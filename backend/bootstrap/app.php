<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Em producao o Caddy termina o HTTPS e repassa a requisicao em HTTP
        // para o nginx. Sem confiar no proxy, o Laravel enxerga "http" e passa
        // a gerar links e redirecionamentos inseguros, quebrando as imagens
        // com aviso de conteudo misto. Os proxies sao containers da rede
        // interna, entao confiar em todos e seguro aqui.
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
