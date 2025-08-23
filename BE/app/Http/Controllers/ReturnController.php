<?php

namespace App\Http\Controllers;

use App\Models\Returns;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReturnController extends Controller
{

    public function index()
    {
        try {

            $query =  Returns::with([
                'client:id,name,document',
                'user:id,name',
                'details'
            ])->select('*')
                ->orderBy('return_number', 'asc');

            if (request()->filled('status')) {
                $query->where('status', request('status'));
            }

            $returns = $query->get();

            return response()->json($returns, 200);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function store(Request $request)
    {
        try {

            DB::beginTransaction();

            $messages = [
                'client_id.required' => 'El cliente es obligatorio.',
                'return_date.required' => 'La fecha de devolución es obligatoria.',
                'reason.required' => 'El motivo de la devolución es obligatorio.',
                'items.required' => 'Los detalles de la devolución son obligatorios.',
                'items.*.product_id.required' => 'El ID del producto es obligatorio.',
                'items.*.amount.required' => 'La cantidad es obligatoria.',
                'items.*.price.required' => 'El campo precio es obligatorio en cada item.',
            ];

            $validator = Validator::make($request->all(), [
                'client_id' => 'required|integer',
                'return_date' => 'required|date',
                'reason' => 'required|string|max:1000',
                'items' => 'required|array',
                'items.*.product_id' => 'required|integer',
                'items.*.amount' => 'required|integer|min:0',
                'items.*.price' => 'required|numeric|min:0',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            }

            $lastReturn = Returns::orderBy('return_number', 'desc')->first();
            $nextReturnNumber = $lastReturn && $lastReturn->return_number
                ? $lastReturn->return_number + 1
                : 250;

            $total = 0;
            foreach ($request->items as $item) {
                $cantidad = (int) $item['amount'];
                $precio = (float) $item['price'];
                $total += $cantidad * $precio;
            }
            $total = round($total, 2);


            $return = Returns::create([
                'user_id' => $request->user()->id,
                'client_id' => $request->client_id,
                'return_number' => $nextReturnNumber,
                'refund_total' => $total,
                'return_date' => $request->return_date,
                'reason' => $request->reason,
                'status' => 'pendiente',
            ]);

            foreach ($request->items as $item) {
                $return->details()->create([
                    'product_id' => $item['product_id'],
                    'amount' => $item['amount'],
                    'price' => $item['price'],
                    'reference' => $item['reference'] ?? null,
                    'product_name' => $item['product_name'] ?? null,
                    'color' => $item['color'] ?? null,
                    'sub_total' => round($item['amount'] * $item['price'], 2),
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Devolución registrada correctamente'], 201);
        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        try {

            DB::beginTransaction();
            
            $messages = [
                'client_id.required' => 'El cliente es obligatorio.',
                'return_date.required' => 'La fecha de devolución es obligatoria.',
                'reason.required' => 'El motivo de la devolución es obligatorio.',
                'items.required' => 'Los detalles de la devolución son obligatorios.',
                'items.*.product_id.required' => 'El ID del producto es obligatorio.',
                'items.*.amount.required' => 'La cantidad es obligatoria.',
                'items.*.price.required' => 'El campo precio es obligatorio en cada item.',
            ];

            $validator = Validator::make($request->all(), [
                'client_id' => 'required|integer',
                'return_date' => 'required|date',
                'reason' => 'required|string|max:1000',
                'items' => 'required|array',
                'items.*.product_id' => 'required|integer',
                'items.*.amount' => 'required|integer|min:0',
                'items.*.price' => 'required|numeric|min:0',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {

                $return = Returns::with('details')->findOrFail($id);

                if ($return->status !== 'pendiente') {
                    return response()->json(['message' => 'Solo se pueden actualizar devoluciones en estado pendiente'], 400);
                }

                $total = 0;
                foreach ($request->items as $item) {
                    $cantidad = (int) $item['amount'];
                    $precio = (float) $item['price'];
                    $total += $cantidad * $precio;  
                }
                $total = round($total, 2);

                $return->update([
                    'client_id' => $request->client_id,
                    'refund_total' => $total,
                    'return_date' => $request->return_date,
                    'reason' => $request->reason,
                ]);

                $return->details()->delete();

                foreach ($request->items as $item) {
                    $return->details()->create([
                        'product_id' => $item['product_id'],
                        'amount' => $item['amount'],
                        'price' => $item['price'],
                        'reference' => $item['reference'] ?? null,
                        'product_name' => $item['product_name'] ?? null,
                        'color' => $item['color'] ?? null,
                        'sub_total' => round($item['amount'] * $item['price'], 2),
                    ]);
                }

                DB::commit();

                return response()->json(['message' => 'Devolución actualizada correctamente'], 200);

            }

        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function destroy(string $id)
    {
        try {

            DB::beginTransaction();

            $return = Returns::findOrFail($id);

            if ($return->status === 'pendiente') {
                $return->status = 'reembolsado';
                $return->refund_date = now();
                $return->save();

                DB::commit();

                return response()->json(['message' => 'Devolución marcada como reembolsada'], 200);
            }
            
            if ($return->status === 'reembolsado') {
                $return->status = 'pendiente';
                $return->refund_date = null;
                $return->save();

                DB::commit();

                return response()->json(['message' => 'Devolución marcada como pendiente'], 200);
            }

        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }
}
