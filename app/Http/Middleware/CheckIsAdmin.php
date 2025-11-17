<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        if (!auth()->check()) {
            Log::warning('CheckIsAdmin Middleware: User not authenticated during admin check.');
            return redirect('/');
        }

        $user = auth()->user();

        if (!$user->is_admin) {
            Log::warning('CheckIsAdmin Middleware: Admin access denied.', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'is_admin_value' => $user->is_admin,
            ]);
            return redirect('/');
        }

        return $next($request);
    }
}
