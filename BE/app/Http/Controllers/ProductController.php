<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        if ($products->isEmpty()) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $product = Product::create([
            'reference' => $request->reference,
            'product_name' => $request->product_name,
            'price' => $request->price,
            'color' => $request->color,
            'size_S' => $request->size_S ?? 0,
            'size_M' => $request->size_M ?? 0,
            'size_L' => $request->size_L ?? 0,
            'size_XL' => $request->size_XL ?? 0,
            'size_2XL' => $request->size_2XL ?? 0,
            'size_3XL' => $request->size_3XL ?? 0,
            'size_4XL' => $request->size_4XL ?? 0,
            'status' => 1,

        ]);

        return response()->json(['message' => 'Producto Registrado Correctamente', 'Producto' => $product], 201);
    }

    public function show(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json($product);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $product->update([
            'reference' => $request->reference,
            'product_name' => $request->product_name,
            'price' => $request->price,
            'color' => $request->color,
            'size_S' => $request->size_S ?? 0,
            'size_M' => $request->size_M ?? 0,
            'size_L' => $request->size_L ?? 0,
            'size_XL' => $request->size_XL ?? 0,
            'size_2XL' => $request->size_2XL ?? 0,
            'size_3XL' => $request->size_3XL ?? 0,
            'size_4XL' => $request->size_4XL ?? 0,
            'status' => $request->status ?? 1, 
        ]);

        return response()->json(['message' => 'Producto actualizado correctamente', 'Producto' => $product]);
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
