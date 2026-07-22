<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use Illuminate\Http\Request;

class SecurityController extends Controller
{
    public function logs(Request $request)
    {
        $query = ActivityLog::with('user');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('action', 'like', "%{$search}%")
                  ->orWhere('admin_name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%");
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    public function blockedIps()
    {
        $ips = BlockedIp::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $ips->map(function ($ip) {
                return [
                    'id' => $ip->id,
                    'ip_address' => $ip->ip_address,
                    'reason' => $ip->reason,
                    'expires_at' => $ip->expires_at ? $ip->expires_at->toIso8601String() : null,
                    'created_at' => $ip->created_at->toIso8601String(),
                ];
            })
        ]);
    }

    public function unblockIp($id, Request $request)
    {
        $ipRecord = BlockedIp::findOrFail($id);
        $ipAddress = $ipRecord->ip_address;
        $ipRecord->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Manually unblocked IP address: $ipAddress",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => "IP address $ipAddress successfully unblocked."
        ]);
    }
}
