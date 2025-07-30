<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Sale;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SaleController extends Controller
{

    public function index()
    {
        try {
            $sales = Sale::with([
                'client:id,name',
                'seller:id,name,seller_code',
                'user:id,name',
                'salesDetails'
            ])->select('id', 'invoice_number', 'client_id', 'seller_id', 'user_id', 'total', 'status', 'created_at')
                ->get();

            return response()->json($sales);
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
                'client_id.required' => 'El campo cliente es obligatorio.',
                'seller_id.required' => 'El campo vendedor es obligatorio.',
                'items.required' => 'El campo items es obligatorio.',
                'items.*.product_id.required' => 'El campo producto es obligatorio en cada item.',
                'items.*.price.required' => 'El campo precio es obligatorio en cada item.',
                'items.*.color.required' => 'El campo color es obligatorio en cada item.',
            ];

            $validator = Validator::make($request->all(), [
                'client_id' => 'required|exists:clients,id',
                'seller_id' => 'required|exists:sellers,id',
                'items' => 'required|array',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.price' => 'required|numeric|min:0',
                'items.*.color' => 'required|string|max:50',
                'items.*.size_S' => 'nullable|integer|min:0',
                'items.*.size_M' => 'nullable|integer|min:0',
                'items.*.size_L' => 'nullable|integer|min:0',
                'items.*.size_XL' => 'nullable|integer|min:0',
                'items.*.size_2XL' => 'nullable|integer|min:0',
                'items.*.size_3XL' => 'nullable|integer|min:0',
                'items.*.size_4XL' => 'nullable|integer|min:0',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {

                $lastSale = Sale::orderBy('invoice_number', 'desc')->first();
                $nextInvoiceNumber = $lastSale && $lastSale->invoice_number
                    ? $lastSale->invoice_number + 1
                    : 4050;

                $total = 0;
                foreach ($request->items as $item) {
                    $cantidad =
                        ($item['size_S'] ?? 0) +
                        ($item['size_M'] ?? 0) +
                        ($item['size_L'] ?? 0) +
                        ($item['size_XL'] ?? 0) +
                        ($item['size_2XL'] ?? 0) +
                        ($item['size_3XL'] ?? 0) +
                        ($item['size_4XL'] ?? 0);
                    $total += $cantidad * floatval($item['price']);
                }

                $sale = Sale::create([
                    'invoice_number' => $nextInvoiceNumber,
                    'client_id' => $request->client_id,
                    'seller_id' => $request->seller_id,
                    'user_id' => auth()->id(),
                    'date' => now(),
                    'total' => $total,
                    'status' => 'pendiente',
                ]);

                foreach ($request->items as $item) {
                    $cantidad =
                        ($item['size_S'] ?? 0) +
                        ($item['size_M'] ?? 0) +
                        ($item['size_L'] ?? 0) +
                        ($item['size_XL'] ?? 0) +
                        ($item['size_2XL'] ?? 0) +
                        ($item['size_3XL'] ?? 0) +
                        ($item['size_4XL'] ?? 0);

                    $sale->salesDetails()->create([
                        'product_id' => $item['product_id'],
                        'reference' => $item['reference'],
                        'product_name' => $item['product_name'],
                        'price' => $item['price'],
                        'color' => $item['color'],
                        'size_S' => $item['size_S'] ?? 0,
                        'size_M' => $item['size_M'] ?? 0,
                        'size_L' => $item['size_L'] ?? 0,
                        'size_XL' => $item['size_XL'] ?? 0,
                        'size_2XL' => $item['size_2XL'] ?? 0,
                        'size_3XL' => $item['size_3XL'] ?? 0,
                        'size_4XL' => $item['size_4XL'] ?? 0,
                        'sub_total' => $cantidad * floatval($item['price']),
                    ]);
                }

                DB::commit();

                return response()->json(['message' => 'Venta registrada correctamente'], 201);
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

            $sale = Sale::findOrFail($id);

            if (!$sale) {
                return response()->json(['message' => 'Venta no encontrada'], 404);
            }

            if ($sale->status === 'cancelada') {
                return response()->json(['message' => 'La venta ya está cancelada'], 400);
            }

            if ($sale->status === 'despachada') {
                return response()->json(['message' => 'No se puede cancelar una venta ya despachada'], 400);
            }

            if ($sale->status === 'pendiente') {
                $sale->status = 'cancelada';
                $sale->save();
                
                DB::commit();
                
                return response()->json(['message' => 'Venta cancelada correctamente'], 200);
            }

            if ($sale->status === 'devuelta') {
                return response()->json(['message' => 'No se puede cancelar una venta devuelta'], 400);
            }
        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function dispatchSale($id)
    {
        try {
            DB::beginTransaction();

            $sale = Sale::with('client')->findOrFail($id);

            if (!$sale) {
                return response()->json(['message' => 'Venta no encontrada'], 404);
            }

            if ($sale->status !== 'pendiente') {
                return response()->json(['message' => 'Solo se pueden despachar ventas pendientes'], 400);
            }

            $existingPayment = Payment::where('sales_id', $sale->id)->first();
            if ($existingPayment) {
                return response()->json(['message' => 'Ya existe un registro de deuda para esta venta'], 400);
            }

            $sale->status = 'despachada';
            $sale->save();

            Payment::create([
                'sales_id' => $sale->id,
                'client_id' => $sale->client_id,
                'invoice_number' => $sale->invoice_number, 
                'total_debt' => $sale->total,
                'total_payment' => 0,
                'status' => false,
            ]);

            DB::commit();

            return response()->json(['message' => 'Venta despachada y deuda registrada correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al despachar la venta: ' . $e->getMessage()], 500);
        }
    }
}
