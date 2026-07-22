<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'slug',
        'sku',
        'brand',
        'model',
        'name_en',
        'name_ar',
        'name_ku',
        'price',
        'discount_price',
        'discount_percentage',
        'discount_start_date',
        'discount_end_date',
        'description_en',
        'description_ar',
        'description_ku',
        'availability_status',
        'featured',
        'status',
        'display_order',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'discount_percentage' => 'integer',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime',
        'featured' => 'boolean',
        'display_order' => 'integer',
    ];

    protected $appends = [
        'active_price',
        'has_active_discount'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order', 'asc');
    }

    public function specifications(): HasMany
    {
        return $this->hasMany(ProductSpecification::class)->orderBy('sort_order', 'asc');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by')->withTrashed();
    }

    // Helper to determine active price after discounts
    public function getActivePriceAttribute()
    {
        $now = now();
        if ($this->discount_price && 
            (!$this->discount_start_date || $this->discount_start_date <= $now) &&
            (!$this->discount_end_date || $this->discount_end_date >= $now)) {
            return $this->discount_price;
        }
        return $this->price;
    }

    // Helper to check if a discount is active
    public function getHasActiveDiscountAttribute()
    {
        $now = now();
        return (bool)($this->discount_price && 
            (!$this->discount_start_date || $this->discount_start_date <= $now) &&
            (!$this->discount_end_date || $this->discount_end_date >= $now));
    }
}
