<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        try {

            DB::beginTransaction();
            
            $messages = [
                'email.required' => 'El campo email es obligatorio.',
                'email.email' => 'El campo email debe ser una dirección de correo electrónico válida.',
                'password.required' => 'El campo password es obligatorio.',
                'password.min' => 'El campo password debe tener al menos 4 caracteres.',
            ];

            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ], $messages);

            if ($validator->fails()) {
                return response()->json($validator->errors())->setStatusCode(400);
            } else {
                $user = User::where('email', $request->email)->first();

                if ($user->status === 0) {
                    return response()->json(['error' => 'Usuario inactivo'], 403);
                }

                if (!$user) {
                    return response()->json(['error' => 'Usuario no encontrado'], 404);
                }

                if ($user && Hash::check($request->password, $user->password)) {
                    $token = $user->createToken('authToken')->plainTextToken;
                    DB::commit();
                    return response()->json([
                        'message' => 'Inicio de sesión exitoso',
                        'user' => $user,
                        'token' => $token,
                    ]);
                }
                

                return response()->json(['error' => 'Credenciales Incorrectas'], 401);
            }
        } catch (QueryException $e) {
            DB::rollBack();
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
        
    }

    public function logout(Request $request)
    {   
        try {
            $request->user()->currentAccessToken()->delete();
    
            return response()->json(['message' => 'Sesión cerrada']);

        } catch (QueryException $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message' => $errorMessage], 400);
        }
    }
}
