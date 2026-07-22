<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSpecification extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'key_en',
        'key_ar',
        'key_ku',
        'value_en',
        'value_ar',
        'value_ku',
        'sort_order'
    ];

    protected $casts = [
        'sort_order' => 'integer'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
