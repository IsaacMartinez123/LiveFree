<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // ... (El código de validación de $request es el mismo)
        $messages = [
            'email.required' => 'El campo email es obligatorio.',
            'email.email' => 'El campo email debe ser una dirección de correo electrónico válida.',
            'password.required' => 'El campo password es obligatorio.',
        ];

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors())->setStatusCode(400);
        }
        // ...

        $user = User::where('email', $request->email)->first();

        // 1. Verificación de credenciales genérica para evitar enumeración.
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        // 2. Verificación del estatus del usuario solo si las credenciales son correctas.
        if ($user->status === 0) {
            return response()->json(['error' => 'Usuario inactivo'], 403);
        }

        // 3. Generación del token si todo es válido.
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // Tu código de logout es bueno, pero puedes manejar errores de forma más general
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Sesión cerrada']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cerrar sesión.'], 500);
        }
    }
}
