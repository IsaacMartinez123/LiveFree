<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{


    public function index()
    {
        try {
            $query = Payment::with([
                'client:id,name',
                'paymentDetails'
            ])->select('id', 'sales_id', 'client_id', 'invoice_number', 'total_debt', 'total_payment', 'status');


            if (request()->filled('status')) {
                $query->where('status', request('status'));
            }

            $payments = $query->get()->map(function ($payment) {
                $payment->client_name = $payment->client?->name;
                return $payment;
            });

            return response()->json($payments);
        } catch (QueryException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }



    public function update(Request $request, string $id)
    {
        try {
            DB::beginTransaction();

            $messages = [
                'required' => 'El campo :attribute es requerido.',
                'numeric' => 'El campo :attribute debe ser un número.',
                'min' => 'El campo :attribute debe ser mayor o igual a :min.',
                'max' => 'El campo :attribute no puede ser mayor a :max.',
                'date_format' => 'El campo :attribute debe tener el formato Y-m-d.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'array' => 'El campo :attribute debe ser un arreglo.',
                'observations.max' => 'El campo observaciones no puede tener más de 255 caracteres.',
                'payment_method.max' => 'El campo método de pago no puede tener más de 255 caracteres.',
            ];

            $validator = Validator::make($request->all(), [
                'paymentDetailData' => 'required|array',
                'paymentDetailData.*.amount' => 'required|numeric|min:0',
                'paymentDetailData.*.payment_method' => 'required|string|max:255',
                'paymentDetailData.*.date' => 'required|date_format:Y-m-d',
                'paymentDetailData.*.observations' => 'nullable|string|max:255',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }

            $payment = Payment::findOrFail($id);

            $payment->paymentDetails()->delete();

            foreach ($request->paymentDetailData as $detail) {
                $payment->paymentDetails()->create([
                    'amount' => floatval($detail['amount']),
                    'payment_method' => $detail['payment_method'],
                    'date' => $detail['date'],
                    'observations' => $detail['observations'] ?? null,
                ]);
            }

            $totalPayment = $payment->paymentDetails()->sum('amount');

            $payment->total_payment = $totalPayment;

            if ($totalPayment > $payment->total_debt) {
                    $status = 'sobrepagado';
                } elseif ($totalPayment == $payment->total_debt) {
                    $status = 'pagado';
                } else {
                    $status = 'pendiente';
                }

            $payment->status = $status;
            
            $payment->save();

            DB::commit();

            return response()->json([
                'message' => 'Abonos actualizados correctamente',
                'total_payment' => $totalPayment,
                'status' => $payment->status
            ]);
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
