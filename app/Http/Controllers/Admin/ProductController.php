<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        // Handle Trash filter
        if ($request->input('status') === 'Trash') {
            $query->onlyTrashed();
        } else {
            // Apply other status filters
            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }
        }

        // Apply Category filter
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->input('category'));
            });
        }

        // Apply Search (Name, SKU, Model, Brand)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_ku', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('display_order', 'asc')
            ->orderBy('id', 'desc')
            ->paginate(20);

        return ProductResource::collection($products);
    }

    public function show($id)
    {
        $product = Product::withTrashed()
            ->with(['category', 'images', 'specifications'])
            ->findOrFail($id);

        return new ProductResource($product);
    }

    public function store(ProductRequest $request)
    {
        $product = DB::transaction(function () use ($request) {
            $price = $request->price;
            $discountPrice = $request->discount_price;
            $discountPercentage = null;

            if ($discountPrice) {
                $discountPercentage = (int)round((($price - $discountPrice) / $price) * 100);
            }

            // Slug generation
            $slug = Str::slug($request->name_en);
            $originalSlug = $slug;
            $counter = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Create product
            $product = Product::create([
                'category_id' => $request->category_id,
                'slug' => $slug,
                'sku' => $request->sku,
                'brand' => $request->brand,
                'model' => $request->model,
                'name_en' => $request->name_en,
                'name_ar' => $request->name_ar,
                'name_ku' => $request->name_ku,
                'price' => $price,
                'discount_price' => $discountPrice,
                'discount_percentage' => $discountPercentage,
                'discount_start_date' => $request->discount_start_date,
                'discount_end_date' => $request->discount_end_date,
                'description_en' => $request->description_en,
                'description_ar' => $request->description_ar,
                'description_ku' => $request->description_ku,
                'availability_status' => $request->availability_status,
                'featured' => $request->boolean('featured'),
                'status' => $request->status,
                'display_order' => $request->input('display_order', 0),
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            // Save Specifications
            if ($request->has('specifications')) {
                foreach ($request->input('specifications') as $spec) {
                    ProductSpecification::create([
                        'product_id' => $product->id,
                        'key_en' => $spec['key_en'],
                        'key_ar' => $spec['key_ar'],
                        'key_ku' => $spec['key_ku'],
                        'value_en' => $spec['value_en'],
                        'value_ar' => $spec['value_ar'],
                        'value_ku' => $spec['value_ku'],
                        'sort_order' => $spec['sort_order'] ?? 0
                    ]);
                }
            }

            // Save Images
            if ($request->has('images') && count($request->images) > 0) {
                foreach ($request->input('images') as $img) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $img['image_path'],
                        'sort_order' => $img['sort_order'] ?? 0
                    ]);
                }
            } else {
                // Default image
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/images/no-image.png',
                    'sort_order' => 0
                ]);
            }

            return $product;
        });

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Created product: {$product->name_en} (SKU: {$product->sku})",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product->load(['category', 'images', 'specifications']))
        ], 201);
    }

    public function update(ProductRequest $request, $id)
    {
        $product = Product::withTrashed()->findOrFail($id);

        $product = DB::transaction(function () use ($request, $product) {
            $price = $request->price;
            $discountPrice = $request->discount_price;
            $discountPercentage = null;

            if ($discountPrice) {
                $discountPercentage = (int)round((($price - $discountPrice) / $price) * 100);
            }

            // Regenerate slug if Name changed
            $slug = $product->slug;
            if ($product->name_en !== $request->name_en) {
                $slug = Str::slug($request->name_en);
                $originalSlug = $slug;
                $counter = 1;
                while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $product->update([
                'category_id' => $request->category_id,
                'slug' => $slug,
                'sku' => $request->sku,
                'brand' => $request->brand,
                'model' => $request->model,
                'name_en' => $request->name_en,
                'name_ar' => $request->name_ar,
                'name_ku' => $request->name_ku,
                'price' => $price,
                'discount_price' => $discountPrice,
                'discount_percentage' => $discountPercentage,
                'discount_start_date' => $request->discount_start_date,
                'discount_end_date' => $request->discount_end_date,
                'description_en' => $request->description_en,
                'description_ar' => $request->description_ar,
                'description_ku' => $request->description_ku,
                'availability_status' => $request->availability_status,
                'featured' => $request->boolean('featured'),
                'status' => $request->status,
                'display_order' => $request->input('display_order', 0),
                'updated_by' => auth()->id(),
            ]);

            // Sync Specifications (Delete & Re-insert)
            $product->specifications()->delete();
            if ($request->has('specifications')) {
                foreach ($request->input('specifications') as $spec) {
                    ProductSpecification::create([
                        'product_id' => $product->id,
                        'key_en' => $spec['key_en'],
                        'key_ar' => $spec['key_ar'],
                        'key_ku' => $spec['key_ku'],
                        'value_en' => $spec['value_en'],
                        'value_ar' => $spec['value_ar'],
                        'value_ku' => $spec['value_ku'],
                        'sort_order' => $spec['sort_order'] ?? 0
                    ]);
                }
            }

            // Sync Images (Delete & Re-insert)
            $product->images()->delete();
            if ($request->has('images') && count($request->images) > 0) {
                foreach ($request->input('images') as $img) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $img['image_path'],
                        'sort_order' => $img['sort_order'] ?? 0
                    ]);
                }
            } else {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/images/no-image.png',
                    'sort_order' => 0
                ]);
            }

            return $product;
        });

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Updated product: {$product->name_en} (SKU: {$product->sku})",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product->load(['category', 'images', 'specifications']))
        ]);
    }

    public function destroy($id, Request $request)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Soft deleted product: {$product->name_en}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product moved to Trash successfully.'
        ]);
    }

    public function restore($id, Request $request)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Restored product: {$product->name_en}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product restored successfully.'
        ]);
    }

    public function forceDelete($id, Request $request)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $productName = $product->name_en;
        
        // ProductImages and ProductSpecifications will cascade delete due to DB constraints
        $product->forceDelete();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'admin_name' => auth()->user()->name,
            'username' => auth()->user()->username,
            'action' => "Permanently deleted product: {$productName}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product permanently deleted.'
        ]);
    }

    public function bulk(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'action' => 'required|in:delete,restore,publish,draft,apply_discount,remove_discount',
            
            // Required if apply_discount
            'discount_price' => 'required_if:action,apply_discount|numeric|min:0',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
        ]);

        $ids = $request->ids;
        $action = $request->action;

        DB::transaction(function () use ($ids, $action, $request) {
            switch ($action) {
                case 'delete':
                    Product::whereIn('id', $ids)->delete();
                    $actionDesc = "Bulk soft-deleted products: " . implode(', ', $ids);
                    break;
                case 'restore':
                    Product::onlyTrashed()->whereIn('id', $ids)->restore();
                    $actionDesc = "Bulk restored products: " . implode(', ', $ids);
                    break;
                case 'publish':
                    Product::whereIn('id', $ids)->update(['status' => 'Published', 'updated_by' => auth()->id()]);
                    $actionDesc = "Bulk published products: " . implode(', ', $ids);
                    break;
                case 'draft':
                    Product::whereIn('id', $ids)->update(['status' => 'Draft', 'updated_by' => auth()->id()]);
                    $actionDesc = "Bulk draft-saved products: " . implode(', ', $ids);
                    break;
                case 'apply_discount':
                    $discountPrice = $request->discount_price;
                    $startDate = $request->discount_start_date;
                    $endDate = $request->discount_end_date;

                    $products = Product::whereIn('id', $ids)->get();
                    foreach ($products as $product) {
                        $percentage = (int)round((($product->price - $discountPrice) / $product->price) * 100);
                        $product->update([
                            'discount_price' => $discountPrice,
                            'discount_percentage' => $percentage,
                            'discount_start_date' => $startDate,
                            'discount_end_date' => $endDate,
                            'updated_by' => auth()->id()
                        ]);
                    }
                    $actionDesc = "Bulk applied discount of $discountPrice IQD to products: " . implode(', ', $ids);
                    break;
                case 'remove_discount':
                    Product::whereIn('id', $ids)->update([
                        'discount_price' => null,
                        'discount_percentage' => null,
                        'discount_start_date' => null,
                        'discount_end_date' => null,
                        'updated_by' => auth()->id()
                    ]);
                    $actionDesc = "Bulk removed discount from products: " . implode(', ', $ids);
                    break;
            }

            ActivityLog::create([
                'user_id' => auth()->id(),
                'admin_name' => auth()->user()->name,
                'username' => auth()->user()->username,
                'action' => $actionDesc,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Bulk operation executed successfully.'
        ]);
    }
}
