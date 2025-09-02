<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\label;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function getLabels(){
        try {
            $labels = label::all();

            if ($labels->isEmpty()) {
                return response()->json(['message' => 'No se encontraron resultados'], 404);
            }
            return response()->json($labels);
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

                DB::commit();

                return response()->json(['message' => 'Cliente Registrado Correctamente', 'cliente' => $client], 201);
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

            DB::beginTransaction();

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

                DB::commit();

                return response()->json(['message' => 'Cliente actualizado correctamente', 'cliente' => $client]);
            }
        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function updateLabel(Request $request, string $id){
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
                'document' => 'required|string|max:20',
                'phone' => 'string|max:40',
                'responsible' => 'string|max:255',
                'address' => 'string|max:255',
                'city' => 'string|max:100',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {
                $label = label::find($id);

                if (!$label) {
                    return response()->json(['message' => 'Rotulo no encontrado'], 404);
                }

                $label->update([
                    'name' => $request->name ?? $label->name,
                    'document' => $request->document ?? $label->document,
                    'phone' => $request->phone ?? $label->phone,
                    'responsible' => $request->responsible ?? $label->responsible,
                    'address' => $request->address ?? $label->address,
                    'city' => $request->city ?? $label->city,
                ]);

                DB::commit();

                return response()->json(['message' => 'Rotulo actualizado correctamente']);
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

            $client = Client::find($id);

            if (!$client) {
                return response()->json(['message' => 'Cliente no encontrado'], 404);
            }

            $client->delete();

            DB::commit();

            return response()->json(['message' => 'Cliente eliminado correctamente']);
        } catch (QueryException $e) {
            DB::rollBack();
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
