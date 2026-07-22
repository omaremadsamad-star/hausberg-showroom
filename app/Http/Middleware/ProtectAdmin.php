<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ProtectAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please log in.',
                ], Response::HTTP_UNAUTHORIZED);
            }
            return redirect('/admin');
        }

        $user = Auth::user();
        if ($user->status !== 'Active') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your administrator account has been disabled.',
                ], Response::HTTP_UNAUTHORIZED);
            }
            return redirect('/admin')->withErrors(['username' => 'Your account is disabled.']);
        }

        return $next($request);
    }
}
