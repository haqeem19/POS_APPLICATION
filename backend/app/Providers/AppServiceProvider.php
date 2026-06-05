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
        if ($this->app->environment('production')) {
            foreach ([
                '/tmp/views',
                '/tmp/framework/cache',
                '/tmp/framework/sessions',
            ] as $path) {
                if (! is_dir($path)) {
                    mkdir($path, 0755, true);
                }
            }
        }
    }
}
