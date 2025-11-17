<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Temporarily halt execution and dump the authenticated user object
        // to the browser to diagnose the issue directly.
        dd(auth()->user());

        // Original logic (will not be reached while dd() is active)
        if (!auth()->check() || !auth()->user()->is_admin) {
            return redirect('/');
        }

        return $next($request);
    }
}
