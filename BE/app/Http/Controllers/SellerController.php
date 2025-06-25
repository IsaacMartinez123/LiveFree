<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    public function index()
    {
        $sellers = Seller::all();
        if ($sellers->isEmpty()) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }
        return response()->json($sellers);
    }

    public function store(Request $request)
    {
        $seller = Seller::create([
            'name' => $request->name,
            'document' => $request->document,
            'phone' => $request->phone,
            'email' => $request->email,
        ]);

        return response()->json(['message' => 'Vendedor Registrado Correctamente', 'vendedor' => $seller], 201);
    }

    public function show(string $id)
    {
        $seller = Seller::find($id);

        if (!$seller) {
            return response()->json(['message' => 'Vendedor no encontrado'], 404);
        }

        return response()->json($seller);
    }

    public function update(Request $request, string $id)
    {
        $seller = Seller::find($id);

        if (!$seller) {
            return response()->json(['message' => 'Vendedor no encontrado'], 404);
        }

        $seller->update([
            'name' => $request->name ?? $seller->name,
            'document' => $request->document ?? $seller->document,
            'phone' => $request->phone ?? $seller->phone,
            'email' => $request->email ?? $seller->email,
        ]);

        return response()->json(['message' => 'Vendedor actualizado correctamente', 'vendedor' => $seller]);
    }

    public function destroy(string $id)
    {
        $seller = Seller::find($id);

        if (!$seller) {
            return response()->json(['message' => 'Vendedor no encontrado'], 404);
        }

        $seller->delete();

        return response()->json(['message' => 'Vendedor eliminado correctamente']);
    }
}
