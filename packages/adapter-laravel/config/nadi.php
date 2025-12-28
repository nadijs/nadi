<?php

return [
    /*
    |--------------------------------------------------------------------------
    | SSR Server URL
    |--------------------------------------------------------------------------
    |
    | The URL of the Node.js SSR server for server-side rendering.
    | Set to null to disable SSR.
    |
    */
    'ssr_url' => env('NADI_SSR_URL', 'http://localhost:13714'),

    /*
    |--------------------------------------------------------------------------
    | SSR Enabled
    |--------------------------------------------------------------------------
    |
    | Enable or disable server-side rendering globally.
    |
    */
    'ssr_enabled' => env('NADI_SSR_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Build Path
    |--------------------------------------------------------------------------
    |
    | The path to the built Nadi assets.
    |
    */
    'build_path' => public_path('build'),
];
