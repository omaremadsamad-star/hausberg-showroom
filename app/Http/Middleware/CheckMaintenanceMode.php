<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next): Response
    {
        if (app()->runningUnitTests()) {
            return $next($request);
        }

        if (Auth::check()) {
            return $next($request);
        }

        $settings = Setting::first();
        if ($settings && $settings->maintenance_mode) {
            if ($request->is('api/admin/*') || $request->is('admin/*') || $request->is('admin')) {
                if ($request->is('api/*') || $request->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'The Admin Panel is currently undergoing maintenance.',
                    ], Response::HTTP_SERVICE_UNAVAILABLE);
                }
                
                // For direct web hits, render maintenance message
                return response('<h1>Admin Panel Under Maintenance</h1><p>The showroom administration area is currently offline for maintenance. Please check back later.</p>', Response::HTTP_SERVICE_UNAVAILABLE);
            }
        }

        return $next($request);
    }
}
