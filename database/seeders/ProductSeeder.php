<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/products_seed.json');
        if (!File::exists($jsonPath)) {
            return;
        }

        $productsData = json_decode(File::get($jsonPath), true);
        if (!$productsData) {
            return;
        }

        foreach ($productsData as $index => $pData) {
            // Find category
            $categoryNameEn = $pData['category'];
            $category = Category::where('name_en', $categoryNameEn)->first();
            
            if (!$category) {
                // Fallback creation if not seeded
                $category = Category::create([
                    'name_en' => $categoryNameEn,
                    'name_ar' => $pData['categoryTrans']['ar'] ?? $categoryNameEn,
                    'name_ku' => $pData['categoryTrans']['ku'] ?? $categoryNameEn,
                    'slug' => Str::slug($categoryNameEn)
                ]);
            }

            // Create product
            $nameEn = $pData['name']['en'] ?? 'Product';
            $slug = Str::slug($nameEn);
            
            // Check uniqueness of slug
            $originalSlug = $slug;
            $counter = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $product = Product::create([
                'category_id' => $category->id,
                'slug' => $slug,
                'sku' => $pData['id'] ?? ('SKU-' . strtoupper(Str::random(8))),
                'brand' => $pData['brand'] ?? 'Hausberg',
                'model' => $pData['model'] ?? 'N/A',
                'name_en' => $nameEn,
                'name_ar' => $pData['name']['ar'] ?? $nameEn,
                'name_ku' => $pData['name']['ku'] ?? $nameEn,
                'price' => $pData['price'] ?? 0,
                // Seed some discounts for demo purposes
                'discount_price' => ($index % 4 === 0) ? ($pData['price'] * 0.8) : null,
                'discount_percentage' => ($index % 4 === 0) ? 20 : null,
                'discount_start_date' => ($index % 4 === 0) ? now()->subDays(5) : null,
                'discount_end_date' => ($index % 4 === 0) ? now()->addDays(15) : null,
                'description_en' => $pData['description']['en'] ?? '',
                'description_ar' => $pData['description']['ar'] ?? '',
                'description_ku' => $pData['description']['ku'] ?? '',
                'availability_status' => 'Available',
                'featured' => $pData['featured'] ?? false,
                'status' => 'Published',
                'display_order' => $index + 1,
                'created_by' => 1, // Will associate with first administrator
                'updated_by' => 1
            ]);

            // Save main image
            if (!empty($pData['image'])) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $pData['image'],
                    'sort_order' => 0
                ]);

                // Seed duplicate main image as gallery images for testing gallery capability
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $pData['image'],
                    'sort_order' => 1
                ]);
            }

            // Save specifications
            if (!empty($pData['specifications'])) {
                foreach ($pData['specifications'] as $specIndex => $spec) {
                    ProductSpecification::create([
                        'product_id' => $product->id,
                        'key_en' => $spec['label']['en'] ?? 'Specification',
                        'key_ar' => $spec['label']['ar'] ?? 'مواصفة',
                        'key_ku' => $spec['label']['ku'] ?? 'تایبەتمەندی',
                        'value_en' => $spec['value']['en'] ?? 'N/A',
                        'value_ar' => $spec['value']['ar'] ?? 'غير متوفر',
                        'value_ku' => $spec['value']['ku'] ?? 'بەردەست نییە',
                        'sort_order' => $specIndex + 1
                    ]);
                }
            }
        }
    }
}
