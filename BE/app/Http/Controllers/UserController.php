<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    public function index()
    {
        try {
            $users = User::select('id', 'name', 'email', 'rol_id', 'status', 'created_at')
                ->with('rol:id,rol_name')
                ->get();

            if ($users->isEmpty()) {
                return response()->json(['message' => 'No se encontraron resultados'], 404);
            }
            return response()->json($users);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    // public function getRoles(){
    //     try {
    //         $roles = Role::select('id', 'rol_name')->get();

    //         if ($roles->isEmpty()) {
    //             return response()->json(['message' => 'No se encontraron resultados'], 404);
    //         }
    //         return response()->json($roles);
    //     } catch (QueryException $e) {
    //         $errorMessage = $e->getMessage();
    //         return response()->json(['message' => $errorMessage], 400);
    //     }
    // }

    public function store(Request $request)
    {
        try {
            $messages = [
                'name.required' => 'El campo nombre es obligatorio.',
                'email.required' => 'El campo email es obligatorio.',
                'email.email' => 'El campo email debe ser una dirección de correo electrónico válida.',
                'rol_id.required' => 'El campo rol es obligatorio.',
                'password.required' => 'El campo contraseña es obligatorio.',
                'password.min' => 'La contraseña debe tener al menos 4 caracteres.',
            ];

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email',
                'rol_id' => 'required|integer|exists:roles,id',
                'password' => 'required|string|min:4',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {
                User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'rol_id' => $request->rol_id,
                    'password' => bcrypt($request->password),
                    'status' => $request->status ?? 1, 
                ]);

                return response()->json(["messagge" => "Se Registró El Usuario Correctamente "], 201);
            }
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function show(string $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            return response()->json($user);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        try{
            $messages = [
                'name.required' => 'El campo nombre es obligatorio.',
                'email.required' => 'El campo email es obligatorio.',
                'email.email' => 'El campo email debe ser una dirección de correo electrónico válida.',
                'rol_id.required' => 'El campo rol es obligatorio.',
            ];
    
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $id,
                'rol_id' => 'required|integer|exists:roles,id',
            ], $messages);
    
            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            }
    
            $user = User::find($id);
    
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
    
            $user->update([
                'name' => $request->name ?? $user->name,
                'email' => $request->email ?? $user->email,
                'rol_id' => $request->rol_id ?? $user->rol_id,
                'password' => isset($request->password) ? bcrypt($request->password) : $user->password,
                'status' => $request->status ?? $user->status,
            ]);
    
            return response()->json(["message" => "Usuario actualizado correctamente"]);

        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }

    public function destroy(string $id)
    {
        try {
            $user = User::find($id);
    
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
    
            $user->status = $user->status ? 0 : 1;
            $user->save();
    
            return response()->json([
                "message" => "Estado de usuario cambiado correctamente",
                "status" => $user->status
            ]);
        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }
}
