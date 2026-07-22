<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\LoginAttempt;
use App\Models\BlockedIp;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $ip = $request->ip();
        $username = $request->input('username');

        // 1. Double check if IP is blacklisted
        $isBlocked = BlockedIp::where('ip_address', $ip)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })->exists();

        if ($isBlocked) {
            return response()->json([
                'success' => false,
                'message' => 'Your IP address has been temporarily blocked due to security reasons.'
            ], Response::HTTP_FORBIDDEN);
        }

        // 2. Check failed attempts in database (Brute-force protection: 20 failed attempts = 24h block)
        $failedAttemptsCount = LoginAttempt::where('ip_address', $ip)
            ->where('created_at', '>', now()->subHours(24))
            ->count();

        if ($failedAttemptsCount >= 20) {
            // Block IP
            BlockedIp::updateOrCreate(
                ['ip_address' => $ip],
                [
                    'reason' => 'Repeated brute force login attacks (exceeded 20 failures).',
                    'expires_at' => now()->addHours(24)
                ]
            );

            // Log activity
            ActivityLog::create([
                'user_id' => null,
                'admin_name' => 'System',
                'username' => 'system',
                'action' => "Temporarily blocked IP address $ip due to brute-force attack.",
                'ip_address' => $ip,
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Your IP address has been temporarily blocked for 24 hours due to multiple failed login attempts.'
            ], Response::HTTP_FORBIDDEN);
        }

        // 3. Throttle login attempts (Lockout: 5 failed attempts = 5min block)
        $throttleKey = 'login-attempt:' . $ip . '|' . $username;

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'success' => false,
                'message' => "Too many login attempts. Please try again in " . ceil($seconds / 60) . " minutes."
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        // 4. Authenticate
        $user = User::where('username', $username)
            ->orWhere('email', $username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Record failed attempt
            LoginAttempt::create([
                'ip_address' => $ip,
                'username' => $username,
                'created_at' => now(),
            ]);

            RateLimiter::hit($throttleKey, 300); // 5 minutes lockout

            // Log activity
            ActivityLog::create([
                'user_id' => null,
                'admin_name' => 'Guest',
                'username' => $username,
                'action' => "Failed login attempt for username: $username",
                'ip_address' => $ip,
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid username or password.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // 5. Check status
        if ($user->status !== 'Active') {
            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'admin_name' => $user->name,
                'username' => $user->username,
                'action' => "Attempted login on disabled account.",
                'ip_address' => $ip,
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Your administrator account has been disabled.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // 6. Log in the user
        Auth::login($user);
        $request->session()->regenerate();

        // Clear attempts
        LoginAttempt::where('ip_address', $ip)->delete();
        RateLimiter::clear($throttleKey);

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Log success
        ActivityLog::create([
            'user_id' => $user->id,
            'admin_name' => $user->name,
            'username' => $user->username,
            'action' => "Successfully logged in.",
            'ip_address' => $ip,
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at ? $user->last_login_at->toIso8601String() : null,
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $ip = $request->ip();

            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'admin_name' => $user->name,
                'username' => $user->username,
                'action' => "Logged out.",
                'ip_address' => $ip,
                'user_agent' => $request->userAgent()
            ]);

            Auth::logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }

    public function check(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'status' => $user->status,
                        'last_login_at' => $user->last_login_at ? $user->last_login_at->toIso8601String() : null,
                    ]
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated.'
        ], Response::HTTP_UNAUTHORIZED);
    }
}
