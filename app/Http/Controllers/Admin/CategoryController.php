<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->orderBy('name_en', 'asc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $categories->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name_en' => $cat->name_en,
                    'name_ar' => $cat->name_ar,
                    'name_ku' => $cat->name_ku,
                    'slug' => $cat->slug,
                    'products_count' => $cat->products_count,
                    'created_at' => $cat->created_at->toIso8601String(),
                ];
            })
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $slug = Str::slug($request->name_en);
        
        $originalSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $category = Category::create([
            'name_en' => $request->name_en,
            'name_ar' => $request->name_ar,
            'name_ku' => $request->name_ku,
            'slug' => $slug,
        ]);

        Cache::forget('website_categories');

        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Created category: {$category->name_en}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'data' => new CategoryResource($category)
        ], 201);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $slug = $category->slug;
        if ($category->name_en !== $request->name_en) {
            $slug = Str::slug($request->name_en);
            $originalSlug = $slug;
            $counter = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $category->update([
            'name_en' => $request->name_en,
            'name_ar' => $request->name_ar,
            'name_ku' => $request->name_ku,
            'slug' => $slug,
        ]);

        Cache::forget('website_categories');

        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Updated category: {$category->name_en}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'data' => new CategoryResource($category)
        ]);
    }

    public function destroy(Category $category, Request $request)
    {
        if ($category->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category. It contains active products.'
            ], 422);
        }

        $categoryName = $category->name_en;
        $category->delete();

        Cache::forget('website_categories');

        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Deleted category: $categoryName",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.'
        ]);
    }
}
