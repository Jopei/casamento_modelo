<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $admin = Admin::where('email', $request->string('email'))->first();

        if (! $admin || ! Hash::check($request->string('password'), $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais invalidas.'],
            ]);
        }

        // Expiracao por token, e nao pela config global do Sanctum: os
        // convidados usam o mesmo driver e devem continuar identificados
        // para acompanhar os presentes que escolheram.
        $expiresAt = now()->addMinutes(config('auth.admin_token_ttl'));

        $token = $admin->createToken('admin', ['admin'], $expiresAt)->plainTextToken;

        return response()->json([
            'admin' => ['id' => $admin->id, 'name' => $admin->name, 'email' => $admin->email],
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function me(Request $request)
    {
        $admin = $request->user('admin');

        return response()->json([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user('admin')->currentAccessToken()->delete();

        return response()->noContent();
    }
}
