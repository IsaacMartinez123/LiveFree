<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::all();
        if ($clients->isEmpty()) {
            return response()->json(['message' => 'No se encontraron resultados'], 404);
        }
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $client = Client::create([
            'name' => $request->name,
            'document' => $request->document,
            'phone' => $request->phone,
            'store_name' => $request->store_name,
            'address' => $request->address,
            'city' => $request->city,
        ]);

        return response()->json(['message' => 'Cliente Registrado Correctamente', 'cliente' => $client], 201);
    }

    public function show(string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        return response()->json($client);
    }

    public function update(Request $request, string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        $client->update([
            'name' => $request->name ?? $client->name,
            'document' => $request->document ?? $client->document,
            'phone' => $request->phone ?? $client->phone,
            'store_name' => $request->store_name ?? $client->store_name,
            'address' => $request->address ?? $client->address,
            'city' => $request->city ?? $client->city,
        ]);

        return response()->json(['message' => 'Cliente actualizado correctamente', 'cliente' => $client]);
    }

    public function destroy(string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        $client->delete();

        return response()->json(['message' => 'Cliente eliminado correctamente']);
    }
}
