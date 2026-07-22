<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $specs = $this->relationLoaded('specifications') ? $this->specifications->map(function ($spec) {
            return [
                'id' => $spec->id,
                'label' => [
                    'en' => $spec->key_en,
                    'ar' => $spec->key_ar,
                    'ku' => $spec->key_ku,
                ],
                'value' => [
                    'en' => $spec->value_en,
                    'ar' => $spec->value_ar,
                    'ku' => $spec->value_ku,
                ],
                'sort_order' => $spec->sort_order,
            ];
        }) : [];

        $imagesList = $this->relationLoaded('images') ? $this->images : collect();
        $mainImage = '/images/no-image.png';
        if ($imagesList->isNotEmpty()) {
            $mainImage = $imagesList->first()->image_path;
        }

        $allImages = $imagesList->map(function ($img) {
            return [
                'id' => $img->id,
                'path' => $img->image_path,
                'sort_order' => $img->sort_order,
            ];
        });

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'brand' => $this->brand,
            'model' => $this->model,
            'name' => [
                'en' => $this->name_en,
                'ar' => $this->name_ar,
                'ku' => $this->name_ku,
            ],
            'price' => (float)$this->price,
            'discount_price' => $this->discount_price ? (float)$this->discount_price : null,
            'discount_percentage' => $this->discount_percentage,
            'discount_start_date' => $this->discount_start_date ? $this->discount_start_date->toIso8601String() : null,
            'discount_end_date' => $this->discount_end_date ? $this->discount_end_date->toIso8601String() : null,
            'has_active_discount' => $this->has_active_discount,
            'active_price' => (float)$this->active_price,
            'description' => [
                'en' => $this->description_en,
                'ar' => $this->description_ar,
                'ku' => $this->description_ku,
            ],
            'category' => $this->relationLoaded('category') ? $this->category->name_en : 'N/A',
            'category_slug' => $this->relationLoaded('category') ? $this->category->slug : null,
            'categoryTrans' => $this->relationLoaded('category') ? [
                'en' => $this->category->name_en,
                'ar' => $this->category->name_ar,
                'ku' => $this->category->name_ku,
            ] : null,
            'availability_status' => $this->availability_status,
            'featured' => $this->featured,
            'status' => $this->status,
            'display_order' => $this->display_order,
            'image' => $mainImage,
            'gallery_images' => $allImages,
            'specifications' => $specs,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
            'updated_at' => $this->updated_at ? $this->updated_at->toIso8601String() : null,
        ];
    }
}
