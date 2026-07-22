<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicApiController;
use App\Http\Controllers\Admin\AuthController;

Route::prefix('api')->group(function () {
    // Public APIs (No authentication required)
    Route::get('/products', [PublicApiController::class, 'products']);
    Route::get('/products/{slug}', [PublicApiController::class, 'productShow']);
    Route::get('/categories', [PublicApiController::class, 'categories']);
    Route::get('/settings', [PublicApiController::class, 'settings']);
    Route::get('/banner', [PublicApiController::class, 'banner']);

    // Admin API Authentication & Check
    Route::post('/admin/login', [AuthController::class, 'login'])->middleware(['maintenance']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/check', [AuthController::class, 'check']);

    Route::middleware(['admin.auth'])->prefix('admin')->group(function () {
        // Dashboard Stats
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index']);

        // Products Management CRUD
        Route::get('/products', [\App\Http\Controllers\Admin\ProductController::class, 'index']);
        Route::get('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'show']);
        Route::post('/products', [\App\Http\Controllers\Admin\ProductController::class, 'store']);
        Route::put('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'update']);
        Route::delete('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'destroy']);
        Route::post('/products/bulk', [\App\Http\Controllers\Admin\ProductController::class, 'bulk']);
        Route::post('/products/{product}/restore', [\App\Http\Controllers\Admin\ProductController::class, 'restore']);
        Route::delete('/products/{product}/force', [\App\Http\Controllers\Admin\ProductController::class, 'forceDelete']);

        // Categories Management CRUD
        Route::get('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'index']);
        Route::post('/categories', [\App\Http\Controllers\Admin\CategoryController::class, 'store']);
        Route::put('/categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [\App\Http\Controllers\Admin\CategoryController::class, 'destroy']);

        // Settings & Banner updates
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'show']);
        Route::put('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'updateSettings']);
        Route::put('/banner', [\App\Http\Controllers\Admin\SettingController::class, 'updateBanner']);

        // Administrators Accounts CRUD
        Route::get('/admins', [\App\Http\Controllers\Admin\AdminController::class, 'index']);
        Route::post('/admins', [\App\Http\Controllers\Admin\AdminController::class, 'store']);
        Route::put('/admins/{admin}', [\App\Http\Controllers\Admin\AdminController::class, 'update']);
        Route::patch('/admins/{admin}/disable', [\App\Http\Controllers\Admin\AdminController::class, 'disable']);
        Route::patch('/admins/{admin}/enable', [\App\Http\Controllers\Admin\AdminController::class, 'enable']);
        Route::delete('/admins/{admin}', [\App\Http\Controllers\Admin\AdminController::class, 'destroy']);
        Route::post('/admins/{admin}/restore', [\App\Http\Controllers\Admin\AdminController::class, 'restore']);

        // Activity Logs
        Route::get('/logs', [\App\Http\Controllers\Admin\SecurityController::class, 'logs']);

        // Blocked IPs
        Route::get('/blocked-ips', [\App\Http\Controllers\Admin\SecurityController::class, 'blockedIps']);
        Route::delete('/blocked-ips/{id}', [\App\Http\Controllers\Admin\SecurityController::class, 'unblockIp']);

        // Backups
        Route::get('/backups', [\App\Http\Controllers\Admin\BackupController::class, 'index']);
        Route::post('/backups', [\App\Http\Controllers\Admin\BackupController::class, 'store']);
        Route::get('/backups/{filename}/download', [\App\Http\Controllers\Admin\BackupController::class, 'download']);
        Route::post('/backups/restore', [\App\Http\Controllers\Admin\BackupController::class, 'restore']);
        Route::delete('/backups/{filename}', [\App\Http\Controllers\Admin\BackupController::class, 'destroy']);
    });
});

Route::fallback(function () {
    $path = public_path('dist/index.html');
    if (file_exists($path)) {
        $content = file_get_contents($path);
        // Inject dynamic CSRF token meta tag into head
        $csrfMeta = '<meta name="csrf-token" content="' . csrf_token() . '">';
        $content = str_replace('<head>', '<head>' . $csrfMeta, $content);
        return response($content);
    }
    
    // In local dev, if build doesn't exist yet, return app.blade.php shell
    return view('app');
});
