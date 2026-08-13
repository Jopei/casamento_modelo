<?php

use App\Models\Admin;
use App\Models\Guest;

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'admin'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'admins'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Two token-based guards backed by Sanctum: "admin" (email+password login,
    | manages site content) and "guest" (passwordless, identified by name+phone).
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Validade da sessao do admin
    |--------------------------------------------------------------------------
    |
    | Minutos que o token do painel continua valido depois do login. Passado
    | esse tempo o admin precisa entrar de novo. Nao afeta os convidados, que
    | recebem tokens sem expiracao.
    |
    */

    'admin_token_ttl' => (int) env('ADMIN_TOKEN_TTL', 120),

    'guards' => [
        'admin' => [
            'driver' => 'sanctum',
            'provider' => 'admins',
        ],

        'guest' => [
            'driver' => 'sanctum',
            'provider' => 'guests',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    */

    'providers' => [
        'admins' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_ADMIN_MODEL', Admin::class),
        ],

        'guests' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_GUEST_MODEL', Guest::class),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
