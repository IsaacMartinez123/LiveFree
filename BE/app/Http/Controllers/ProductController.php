<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class ProductController extends Controller
{
    public function index()
    {
        try {
            $query = Product::select(
                'id',
                'reference',
                'product_name',
                'price',
                'color',
                'size_S',
                'size_M',
                'size_L',
                'size_XL',
                'size_2XL',
                'size_3XL',
                'size_4XL',
                'status'
            );

            if (request()->filled('status')) {
                $query->where('status', request('status'));
            }

            $products = $query->get();

            return response()->json($products);
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
                'numeric' => 'El campo :attribute debe ser un número.',
                'min' => 'El campo :attribute debe ser al menos :min.',
                'max' => 'El campo :attribute no puede ser mayor a :max.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
            ];

            $validator = Validator::make($request->all(), [
                'reference' => 'required|string|max:255',
                'product_name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'color' => 'required|string|max:50',
                'size_S' => 'nullable|numeric|min:0',
                'size_M' => 'nullable|numeric|min:0',
                'size_L' => 'nullable|numeric|min:0',
                'size_XL' => 'nullable|numeric|min:0',
                'size_2XL' => 'nullable|numeric|min:0',
                'size_3XL' => 'nullable|numeric|min:0',
                'size_4XL' => 'nullable|numeric|min:0',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {

                $size_S = $request->size_S ?? 0;
                $size_M = $request->size_M ?? 0;
                $size_L = $request->size_L ?? 0;
                $size_XL = $request->size_XL ?? 0;
                $size_2XL = $request->size_2XL ?? 0;
                $size_3XL = $request->size_3XL ?? 0;
                $size_4XL = $request->size_4XL ?? 0;

                $status = (
                    $size_S == 0 &&
                    $size_M == 0 &&
                    $size_L == 0 &&
                    $size_XL == 0 &&
                    $size_2XL == 0 &&
                    $size_3XL == 0 &&
                    $size_4XL == 0
                ) ? 'agotado' : 'disponible';

                $product = Product::create([
                    'reference' => $request->reference,
                    'product_name' => $request->product_name,
                    'price' => $request->price,
                    'color' => $request->color,
                    'size_S' => $size_S,
                    'size_M' => $size_M,
                    'size_L' => $size_L,
                    'size_XL' => $size_XL,
                    'size_2XL' => $size_2XL,
                    'size_3XL' => $size_3XL,
                    'size_4XL' => $size_4XL,
                    'status' => $status,
                ]);

                DB::commit();

                return response()->json(['message' => 'Producto Registrado Correctamente', 'Producto' => $product], 201);
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
            $product = Product::find($id);

            if (!$product) {
                return response()->json(['message' => 'Producto no encontrado'], 404);
            }

            return response()->json($product);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        try {

            DB::beginTransaction();

            $product = Product::find($id);

            if (!$product) {
                return response()->json(['message' => 'Producto no encontrado'], 404);
            }

            $messages = [
                'required' => 'El campo :attribute es requerido.',
                'numeric' => 'El campo :attribute debe ser un número.',
                'min' => 'El campo :attribute debe ser al menos :min.',
                'max' => 'El campo :attribute no puede ser mayor a :max.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
            ];

            $validator = Validator::make($request->all(), [
                'reference' => 'required|string|max:255',
                'product_name' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'color' => 'required|string|max:50',
                'size_S' => 'nullable|numeric|min:0',
                'size_M' => 'nullable|numeric|min:0',
                'size_L' => 'nullable|numeric|min:0',
                'size_XL' => 'nullable|numeric|min:0',
                'size_2XL' => 'nullable|numeric|min:0',
                'size_3XL' => 'nullable|numeric|min:0',
                'size_4XL' => 'nullable|numeric|min:0',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {

                $size_S = $request->size_S ?? 0;
                $size_M = $request->size_M ?? 0;
                $size_L = $request->size_L ?? 0;
                $size_XL = $request->size_XL ?? 0;
                $size_2XL = $request->size_2XL ?? 0;
                $size_3XL = $request->size_3XL ?? 0;
                $size_4XL = $request->size_4XL ?? 0;

                $status = (
                    $size_S == 0 &&
                    $size_M == 0 &&
                    $size_L == 0 &&
                    $size_XL == 0 &&
                    $size_2XL == 0 &&
                    $size_3XL == 0 &&
                    $size_4XL == 0
                ) ? 'agotado' : 'disponible';

                $product->update([
                    'reference' => $request->reference,
                    'product_name' => $request->product_name,
                    'price' => $request->price,
                    'color' => $request->color,
                    'size_S' => $size_S ?? 0,
                    'size_M' => $size_M ?? 0,
                    'size_L' => $size_L ?? 0,
                    'size_XL' => $size_XL ?? 0,
                    'size_2XL' => $size_2XL ?? 0,
                    'size_3XL' => $size_3XL ?? 0,
                    'size_4XL' => $size_4XL ?? 0,
                    'status' => $status ?? 1,
                ]);

                DB::commit();

                return response()->json(['message' => 'Producto actualizado correctamente', 'Producto' => $product]);
            }
        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function destroy(string $id)
    {   
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
