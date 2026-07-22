<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminController extends Controller
{
    public function index()
    {
        $admins = User::withTrashed()->get();

        return response()->json([
            'success' => true,
            'data' => $admins->map(function ($admin) {
                return [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'username' => $admin->username,
                    'email' => $admin->email,
                    'status' => $admin->status,
                    'last_login_at' => $admin->last_login_at ? $admin->last_login_at->toIso8601String() : null,
                    'created_at' => $admin->created_at->toIso8601String(),
                    'is_deleted' => $admin->trashed()
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:100|unique:users,username',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => ['required', Password::min(8)],
            'status' => 'required|in:Active,Disabled',
        ]);

        $admin = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => $request->status,
        ]);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Created administrator account: {$admin->username}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Administrator account created successfully.',
            'data' => $admin
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $admin = User::withTrashed()->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:100|unique:users,username,' . $admin->id,
            'email' => 'required|email|max:100|unique:users,email,' . $admin->id,
            'password' => ['nullable', Password::min(8)],
            'status' => 'required|in:Active,Disabled',
        ]);

        $updateData = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'status' => $request->status,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $admin->update($updateData);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Updated administrator account: {$admin->username}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Administrator account updated successfully.',
            'data' => $admin
        ]);
    }

    public function disable($id, Request $request)
    {
        $admin = User::withTrashed()->findOrFail($id);
        $admin->update(['status' => 'Disabled']);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Disabled administrator account: {$admin->username}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => "Administrator account {$admin->username} has been disabled."
        ]);
    }

    public function enable($id, Request $request)
    {
        $admin = User::withTrashed()->findOrFail($id);
        $admin->update(['status' => 'Active']);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Enabled administrator account: {$admin->username}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => "Administrator account {$admin->username} has been activated."
        ]);
    }

    public function destroy($id, Request $request)
    {
        $admin = User::findOrFail($id);
        
        // Prevent deleting oneself
        if ($admin->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own administrator account.'
            ], 422);
        }

        $admin->delete();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Soft deleted administrator account: {$admin->username}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Administrator account soft-deleted.'
        ]);
    }

    public function restore($id, Request $request)
    {
        $admin = User::onlyTrashed()->findOrFail($id);
        $admin->restore();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Restored administrator account: {$admin->username}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Administrator account restored.'
        ]);
    }
}
