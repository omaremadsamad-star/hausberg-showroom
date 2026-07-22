<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Banner;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    public function show()
    {
        $settings = Setting::first();
        $banner = Banner::first();

        return response()->json([
            'success' => true,
            'data' => [
                'settings' => $settings,
                'banner' => $banner
            ]
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:100',
            'whatsapp_number' => 'required|string|max:30',
            'phone_number' => 'required|string|max:30',
            'email' => 'required|email|max:100',
            'address_en' => 'required|string',
            'address_ar' => 'required|string',
            'address_ku' => 'required|string',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'maintenance_mode' => 'boolean'
        ]);

        $settings = Setting::first();
        if (!$settings) {
            $settings = new Setting();
        }

        $settings->fill($request->all());
        $settings->maintenance_mode = $request->boolean('maintenance_mode');
        $settings->save();

        // Clear cache
        Cache::forget('website_settings');

        // Log activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Updated website settings.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully.',
            'data' => $settings
        ]);
    }

    public function updateBanner(Request $request)
    {
        $request->validate([
            'image_path' => 'required|string',
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'title_ku' => 'required|string|max:255',
            'subtitle_en' => 'required|string',
            'subtitle_ar' => 'required|string',
            'subtitle_ku' => 'required|string',
            'button_text_en' => 'required|string|max:50',
            'button_text_ar' => 'required|string|max:50',
            'button_text_ku' => 'required|string|max:50',
            'button_link' => 'required|string|max:255'
        ]);

        $banner = Banner::first();
        if (!$banner) {
            $banner = new Banner();
        }

        $banner->fill($request->all());
        $banner->save();

        // Clear cache
        Cache::forget('website_banner');

        // Log activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Updated homepage hero banner settings.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Homepage banner updated successfully.',
            'data' => $banner
        ]);
    }
}
