<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class SaleController extends Controller
{

    public function index()
    {   
        try {
            $sales = Sale::with([
                'client:id,name',
                'seller:id,name',
                'user:id,name',
                'salesDetails'
            ])->select('id', 'invoice_number', 'client_id', 'seller_id', 'user_id', 'total', 'status' , 'created_at')
            ->get();
    
            return response()->json($sales);

        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function store(Request $request)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }


    public function destroy(string $id)
    {
        try {

            $sale = Sale::findOrFail($id);
            
            if(!$sale) {
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
                
                return response()->json(['message' => 'Venta cancelada correctamente'], 200);
            }
            
            return response()->json(['message' => 'Estado de venta no válido para cancelación'], 400);

        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }
}
