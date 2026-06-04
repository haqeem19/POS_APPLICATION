<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('about-pos', function (): void {
    $this->info('POS Application API');
});
