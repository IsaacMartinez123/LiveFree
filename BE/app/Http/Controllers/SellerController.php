<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SellerController extends Controller
{
    public function index()
    {
        try {
            $sellers = Seller::all();
            if ($sellers->isEmpty()) {
                return response()->json(['message' => 'No se encontraron resultados'], 404);
            }
            return response()->json($sellers);
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
                'required' => 'El campo :attribute es requerido.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'max' => 'El campo :attribute no puede ser mayor a :max caracteres.',
                'unique' => 'El campo :attribute ya existe en la base de datos.',
            ];

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'document' => 'required|string|max:20|unique:sellers,document',
                'phone' => 'nullable|string|max:15',
                'seller_code' => 'nullable|max:255|unique:sellers,seller_code',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {
                $seller = Seller::create([
                    'name' => $request->name,
                    'document' => $request->document,
                    'phone' => $request->phone,
                    'seller_code' => $request->seller_code,
                ]);

                DB::commit();

                return response()->json(['message' => 'Vendedor Registrado Correctamente', 'vendedor' => $seller], 201);
            }
        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $seller = Seller::find($id);

            if (!$seller) {
                return response()->json(['message' => 'Vendedor no encontrado'], 404);
            }

            return response()->json($seller);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        try {

            DB::beginTransaction();

            $messages = [
                'required' => 'El campo :attribute es requerido.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'max' => 'El campo :attribute no puede ser mayor a :max caracteres.',
                'unique' => 'El campo :attribute ya existe en la base de datos.',
            ];

            $validator = Validator::make($request->all(), [
                'name' => 'nullable|string|max:255',
                'document' => 'nullable|string|max:20|unique:sellers,document,' . $id,
                'phone' => 'nullable|string|max:15',
                'seller_code' => 'nullable|max:255|unique:sellers,seller_code,' . $id,
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {
                $seller = Seller::find($id);

                if (!$seller) {
                    return response()->json(['message' => 'Vendedor no encontrado'], 404);
                }

                $seller->update([
                    'name' => $request->name ?? $seller->name,
                    'document' => $request->document ?? $seller->document,
                    'phone' => $request->phone ?? $seller->phone,
                    'seller_code' => $request->seller_code ?? $seller->seller_code,
                ]);

                DB::commit();

                return response()->json(['message' => 'Vendedor actualizado correctamente', 'vendedor' => $seller]);
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
            $seller = Seller::find($id);

            if (!$seller) {
                return response()->json(['message' => 'Vendedor no encontrado'], 404);
            }

            $seller->delete();
            DB::commit();
            return response()->json(['message' => 'Vendedor eliminado correctamente']);
        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function checkDocument(Request $request)
    {
        $document = $request->query('document');
        $exists = Seller::where('document', $document)->exists();
        return response()->json(['exists' => $exists]);
    }

    public function checkCode(Request $request)
    {
        $exists = Seller::where('seller_code', $request->seller_code)->exists();
        return response()->json(['exists' => $exists]);
    }
}
