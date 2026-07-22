<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $publishedProducts = Product::where('status', 'Published')->count();
        $draftProducts = Product::where('status', 'Draft')->count();
        $featuredProducts = Product::where('featured', true)->count();
        $outOfStockProducts = Product::where('availability_status', 'Out Of Stock')->count();
        $deletedProducts = Product::onlyTrashed()->count();

        $now = now();
        $discountedProducts = Product::whereNotNull('discount_price')
            ->where(function ($q) use ($now) {
                $q->whereNull('discount_start_date')->orWhere('discount_start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('discount_end_date')->orWhere('discount_end_date', '>=', $now);
            })
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_products' => $totalProducts,
                'total_categories' => $totalCategories,
                'published_products' => $publishedProducts,
                'draft_products' => $draftProducts,
                'featured_products' => $featuredProducts,
                'discounted_products' => $discountedProducts,
                'out_of_stock_products' => $outOfStockProducts,
                'deleted_products' => $deletedProducts,
            ]
        ]);
    }
}
