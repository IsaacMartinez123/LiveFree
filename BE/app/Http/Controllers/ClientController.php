<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function index()
    {
        try {
            $clients = Client::all();
            if ($clients->isEmpty()) {
                return response()->json(['message' => 'No se encontraron resultados'], 404);
            }
            return response()->json($clients);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function store(Request $request)
    {
        try {

            $messages = [
                'required' => 'El campo :attribute es requerido.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'max' => 'El campo :attribute no puede ser mayor a :max caracteres.',
                'unique' => 'El campo :attribute ya existe en la base de datos.',
            ];

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'document' => 'required|string|max:20|unique:clients,document',
                'phone' => 'nullable|string|max:40',
                'store_name' => 'nullable|string|max:255',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {
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
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $client = Client::find($id);

            if (!$client) {
                return response()->json(['message' => 'Cliente no encontrado'], 404);
            }

            return response()->json($client);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        try {

            $messages = [
                'required' => 'El campo :attribute es requerido.',
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'max' => 'El campo :attribute no puede ser mayor a :max caracteres.',
                'unique' => 'El campo :attribute ya existe en la base de datos.',
            ];

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'document' => 'required|string|max:20|unique:clients,document,' . $id,
                'phone' => 'nullable|string|max:40',
                'store_name' => 'nullable|string|max:255',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {
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
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function destroy(string $id)
    {
        try {

            $client = Client::find($id);

            if (!$client) {
                return response()->json(['message' => 'Cliente no encontrado'], 404);
            }

            $client->delete();

            return response()->json(['message' => 'Cliente eliminado correctamente']);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function checkDocument(Request $request)
    {
        $document = $request->query('document');
        $exists = Client::where('document', $document)->exists();
        return response()->json(['exists' => $exists]);
    }
}
