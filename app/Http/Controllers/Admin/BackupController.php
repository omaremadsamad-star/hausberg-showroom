<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BackupService;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class BackupController extends Controller
{
    protected $backupService;

    public function __construct(BackupService $backupService)
    {
        $this->backupService = $backupService;
    }

    public function index()
    {
        if (!Storage::disk('local')->exists('backups')) {
            Storage::disk('local')->makeDirectory('backups');
        }

        $files = Storage::disk('local')->files('backups');
        $backups = array_map(function ($filePath) {
            return [
                'filename' => basename($filePath),
                'size' => Storage::disk('local')->size($filePath),
                'created_at' => date('Y-m-d H:i:s', Storage::disk('local')->lastModified($filePath)),
            ];
        }, $files);

        // Sort by date descending
        usort($backups, function ($a, $b) {
            return strcmp($b['created_at'], $a['created_at']);
        });

        return response()->json([
            'success' => true,
            'data' => $backups
        ]);
    }

    public function store(Request $request)
    {
        $filename = $this->backupService->generateBackup();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Generated database SQL backup file: $filename",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Database backup generated successfully.',
            'data' => [
                'filename' => $filename
            ]
        ], 201);
    }

    public function download($filename)
    {
        $path = 'backups/' . $filename;
        if (!Storage::disk('local')->exists($path)) {
            abort(404, 'Backup file not found.');
        }

        return Storage::disk('local')->download($path);
    }

    public function restore(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file',
        ]);

        $file = $request->file('backup_file');
        $sqlContent = file_get_contents($file->getRealPath());

        if (empty($sqlContent)) {
            return response()->json([
                'success' => false,
                'message' => 'Uploaded file is empty.'
            ], 422);
        }

        // Run backup restore
        $this->backupService->restoreBackup($sqlContent);

        // Flush all website cache
        Cache::flush();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Restored database from uploaded SQL file: " . $file->getClientOriginalName(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Database restored successfully. Caches flushed.'
        ]);
    }

    public function destroy($filename, Request $request)
    {
        $path = 'backups/' . $filename;
        if (!Storage::disk('local')->exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Backup file not found.'
            ], 404);
        }

        Storage::disk('local')->delete($path);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Deleted database backup file: $filename",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Backup file deleted successfully.'
        ]);
    }
}
