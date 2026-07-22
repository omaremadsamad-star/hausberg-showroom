<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\BlockedIp;
use Symfony\Component\HttpFoundation\Response;

class CheckBlockedIp
{
    public function handle(Request $request, Closure $next): Response
    {
        if (app()->runningUnitTests()) {
            return $next($request);
        }

        $ip = $request->ip();

        $blocked = BlockedIp::where('ip_address', $ip)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->first();

        if ($blocked) {
            // Check if it has expired but is still in database (cleanup lazily)
            if ($blocked->expires_at && $blocked->expires_at <= now()) {
                $blocked->delete();
            } else {
                if ($request->is('api/*') || $request->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Your IP address (' . $ip . ') has been temporarily blocked due to security rules.',
                    ], Response::HTTP_FORBIDDEN);
                }

                abort(Response::HTTP_FORBIDDEN, 'Access denied. Your IP address is blocked.');
            }
        }

        return $next($request);
    }
}
