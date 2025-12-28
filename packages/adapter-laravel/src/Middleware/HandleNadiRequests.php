<?php

namespace Nadi\Middleware;

use Closure;
use Illuminate\Http\Request;

class HandleNadiRequests
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Add Nadi version header
        $response = $next($request);

        $response->headers->set('X-Nadi-Version', '0.2.0');

        // Handle CSRF token for Nadi requests
        if ($request->header('X-Nadi')) {
            $response->headers->set('X-CSRF-Token', csrf_token());
        }

        return $response;
    }
}
