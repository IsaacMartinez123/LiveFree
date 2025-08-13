<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Product;
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
            $query = Sale::with([
                'client:id,name',
                'seller:id,name,seller_code',
                'user:id,name',
                'salesDetails'
            ])->select('id', 'invoice_number', 'client_id', 'seller_id', 'user_id', 'total', 'status', 'created_at');

            if (request()->filled('status')) {
                $query->where('status', request('status'));
            }

            $sales = $query->get();

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

    public function update(Request $request, string $id)
    {
        try {
            DB::beginTransaction();

            // return response()->json($request->all(), 200);

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
                $sale = Sale::with('salesDetails')->findOrFail($id);

                if ($sale->status !== 'pendiente') {
                    return response()->json(['message' => 'Solo se pueden actualizar ventas en estado pendiente'], 400);
                }

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

                $sale->update([
                    'client_id' => $request->client_id,
                    'seller_id' => $request->seller_id,
                    'total' => $total,
                ]);

                $sale->salesDetails()->delete();

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
                return response()->json(['message' => 'Venta actualizada correctamente'], 200);
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

            $sale = Sale::with('salesDetails')->findOrFail($id);

            $payment = Payment::where('sales_id', $sale->id)->first();

            if ($sale->status === 'cancelada') {
                $sale->status = 'pendiente';
                $sale->save();

                DB::commit();
                return response()->json(['message' => 'Venta reactivada correctamente'], 200);
            }

            if (in_array($sale->status, ['pendiente', 'despachada'])) {

                if ($sale->status === 'despachada') {
                    $sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

                    foreach ($sale->salesDetails as $detail) {
                        $product = Product::findOrFail($detail->product_id);

                        foreach ($sizes as $size) {
                            $detailSize = 'size_' . $size;
                            $productSize = 'size_' . $size;

                            $qtyToRestore = $detail->$detailSize;

                            if ($qtyToRestore > 0) {
                                $product->$productSize += $qtyToRestore;
                            }
                        }

                        $anyNegative = false;
                        foreach ($sizes as $size) {
                            if ($product->{'size_' . $size} < 0) {
                                $anyNegative = true;
                                break;
                            }
                        }

                        if (!$anyNegative && $product->status === 'sobrevendido') {
                            $product->status = 'disponible';
                        }

                        $product->save();
                    }
                }
                if ($payment) {
                    $payment->status = 'cancelado';
                    $payment->save();
                }
                $sale->status = 'cancelada';
                $sale->save();

                DB::commit();
                return response()->json(['message' => 'Venta cancelada correctamente, productos devueltos al inventario y estado del abono cambiado'], 200);
            }

            return response()->json(['message' => 'Estado de la venta no válido para cancelar'], 400);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }


    public function dispatchSale($id)
    {
        try {
            DB::beginTransaction();

            $sale = Sale::with(['client', 'salesDetails'])->findOrFail($id);

            if ($sale->status !== 'pendiente') {
                return response()->json(['message' => 'Solo se pueden despachar ventas pendientes'], 400);
            }

            $sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

            foreach ($sale->salesDetails as $detail) {
                $product = Product::findOrFail($detail->product_id);

                foreach ($sizes as $size) {
                    $detailSize = 'size_' . $size;
                    $productSize = 'size_' . $size;

                    $qtyToDiscount = $detail->$detailSize;

                    if ($qtyToDiscount > 0) {
                        $product->$productSize -= $qtyToDiscount;
                    }
                }

                foreach ($sizes as $size) {
                    $productSize = 'size_' . $size;
                    if ($product->$productSize < 0) {
                        $product->status = 'sobrevendido';
                        break;
                    }
                }

                $product->save();
            }

            $sale->status = 'despachada';
            $sale->save();

            $existingPayment = Payment::where('sales_id', $sale->id)->first();

            if ($existingPayment) {

                $existingPayment->total_debt = $sale->total;

                $totalPayment = $existingPayment->paymentDetails()->sum('amount');
                $existingPayment->total_payment = $totalPayment;

                if ($totalPayment > $existingPayment->total_debt) {
                    $status = 'sobrepagado';
                } elseif ($totalPayment == $existingPayment->total_debt) {
                    $status = 'pagado';
                } else {
                    $status = 'pendiente';
                }

                $existingPayment->update([
                    'client_id' => $sale->client_id,
                    'total_debt' => $sale->total,
                    'status' => $status,
                ]);
            } else {
                Payment::create([
                    'sales_id' => $sale->id,
                    'client_id' => $sale->client_id,
                    'invoice_number' => $sale->invoice_number,
                    'total_debt' => $sale->total,
                    'total_payment' => 0,
                    'status' => 'pendiente',
                ]);
            }


            DB::commit();
            return response()->json(['message' => 'Venta despachada y productos actualizados correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al despachar la venta: ' . $e->getMessage()], 500);
        }
    }
}
