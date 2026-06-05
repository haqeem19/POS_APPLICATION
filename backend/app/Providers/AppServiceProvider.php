<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\ViewServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->register(ViewServiceProvider::class);
    }

    public function boot(): void
    {
        //
    }
}
