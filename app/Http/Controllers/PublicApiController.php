<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\SettingResource;
use App\Models\Product;
use App\Models\Category;
use App\Models\Setting;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PublicApiController extends Controller
{
    public function products(Request $request)
    {
        // Only load published products
        $query = Product::where('status', 'Published')
            ->with(['category', 'images', 'specifications']);

        // 1. Search (across all languages and specification keys/values)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_ku', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($catQ) use ($search) {
                      $catQ->where('name_en', 'like', "%{$search}%")
                           ->orWhere('name_ar', 'like', "%{$search}%")
                           ->orWhere('name_ku', 'like', "%{$search}%");
                  })
                  ->orWhereHas('specifications', function ($specQ) use ($search) {
                      $specQ->where('key_en', 'like', "%{$search}%")
                            ->orWhere('key_ar', 'like', "%{$search}%")
                            ->orWhere('key_ku', 'like', "%{$search}%")
                            ->orWhere('value_en', 'like', "%{$search}%")
                            ->orWhere('value_ar', 'like', "%{$search}%")
                            ->orWhere('value_ku', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Filter by Category
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // 3. Filter by Brand
        if ($request->filled('brand')) {
            $query->where('brand', $request->input('brand'));
        }

        // 4. Filter by Availability
        if ($request->filled('availability')) {
            $query->where('availability_status', $request->input('availability'));
        }

        // 5. Filter by Price Range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // 6. Filter by Featured
        if ($request->input('featured') == 1) {
            $query->where('featured', true);
        }

        // 7. Sorting
        $sort = $request->input('sort', 'featured');
        switch ($sort) {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'price_low':
                $query->orderByRaw('CASE WHEN discount_price IS NOT NULL THEN discount_price ELSE price END ASC');
                break;
            case 'price_high':
                $query->orderByRaw('CASE WHEN discount_price IS NOT NULL THEN discount_price ELSE price END DESC');
                break;
            case 'name_asc':
                $query->orderBy('name_en', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name_en', 'desc');
                break;
            case 'discount':
                $query->orderBy('discount_percentage', 'desc');
                break;
            case 'featured':
            default:
                // Primary sorting: featured first, then manual display_order, then ID desc
                $query->orderBy('featured', 'desc')
                      ->orderBy('display_order', 'asc')
                      ->orderBy('id', 'desc');
                break;
        }

        // Paginate exactly 12 products per page
        $products = $query->paginate(12);

        return ProductResource::collection($products);
    }

    public function productShow($slug)
    {
        $product = Product::where('status', 'Published')
            ->where('slug', $slug)
            ->with(['category', 'images', 'specifications'])
            ->firstOrFail();

        return new ProductResource($product);
    }

    public function categories()
    {
        $categories = Category::orderBy('name_en', 'asc')->get();
        return CategoryResource::collection($categories);
    }

    public function settings()
    {
        $settings = Setting::first();

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'Settings not found.'
            ], 404);
        }

        return new SettingResource($settings);
    }

    public function banner()
    {
        $banner = Banner::first();

        if (!$banner) {
            return response()->json([
                'success' => false,
                'message' => 'Homepage banner not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'image_path' => $banner->image_path,
                'title' => [
                    'en' => $banner->title_en,
                    'ar' => $banner->title_ar,
                    'ku' => $banner->title_ku,
                ],
                'subtitle' => [
                    'en' => $banner->subtitle_en,
                    'ar' => $banner->subtitle_ar,
                    'ku' => $banner->subtitle_ku,
                ],
                'button_text' => [
                    'en' => $banner->button_text_en,
                    'ar' => $banner->button_text_ar,
                    'ku' => $banner->button_text_ku,
                ],
                'button_link' => $banner->button_link
            ]
        ]);
    }
}
