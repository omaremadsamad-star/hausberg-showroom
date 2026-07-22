<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product'); // If updating, ignore this product's SKU / slug
        $id = $productId ? (is_object($productId) ? $productId->id : $productId) : null;

        return [
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|max:100|unique:products,sku,' . $id,
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'name_en' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'name_ku' => 'required|string|max:255',
            'price' => 'required|numeric|min:0.01',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'description_ku' => 'nullable|string',
            'availability_status' => 'required|in:Available,Out Of Stock,Coming Soon,Discontinued',
            'featured' => 'boolean',
            'status' => 'required|in:Draft,Published',
            'display_order' => 'integer',
            
            // Validate dynamic specs
            'specifications' => 'nullable|array',
            'specifications.*.key_en' => 'required|string|max:100',
            'specifications.*.key_ar' => 'required|string|max:100',
            'specifications.*.key_ku' => 'required|string|max:100',
            'specifications.*.value_en' => 'required|string|max:255',
            'specifications.*.value_ar' => 'required|string|max:255',
            'specifications.*.value_ku' => 'required|string|max:255',
            'specifications.*.sort_order' => 'integer',

            // Validate dynamic images
            'images' => 'nullable|array',
            'images.*.image_path' => 'required|string',
            'images.*.sort_order' => 'integer'
        ];
    }
}
