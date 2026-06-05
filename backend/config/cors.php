<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        rtrim(env('FRONTEND_URL', 'http://127.0.0.1:5173'), '/'),
        'https://pos-application-rust.vercel.app',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:4173',
        'http://localhost:4173',
    ],
    'allowed_origins_patterns' => [
        '#^https://pos-application-[a-z0-9-]+\.vercel\.app$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
