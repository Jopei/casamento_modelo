<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
     * Os convidados abrem o site de qualquer lugar (celular na rede local,
     * dominio proprio depois do deploy), entao a origem nao e conhecida de
     * antemao. Liberar todas e seguro aqui porque nao ha cookies de sessao:
     * 'supports_credentials' esta desligado e a autenticacao do convidado
     * viaja no header Authorization, que outra origem nao consegue ler.
     * Defina CORS_ALLOWED_ORIGINS (separado por virgula) para restringir.
     */
    'allowed_origins' => explode(',', (string) env('CORS_ALLOWED_ORIGINS', '*')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
