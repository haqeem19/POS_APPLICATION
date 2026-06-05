<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => config('app.name'),
    'status' => 'running',
    'message' => 'Backend POS API aktif. Gunakan endpoint /api/* atau jalankan frontend React.',
    'endpoints' => [
        'health' => url('/api/health'),
        'dashboard' => url('/api/dashboard'),
    ],
]));
