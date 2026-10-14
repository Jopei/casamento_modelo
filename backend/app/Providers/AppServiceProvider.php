<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('gift-reserve', fn (Request $request) => [
            Limit::perMinute(6)->by('gift-reserve-min:'.$request->ip()),
            Limit::perHour(40)->by('gift-reserve-hour:'.$request->ip()),
        ]);
    }
}
