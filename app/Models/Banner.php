<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_path',
        'title_en',
        'title_ar',
        'title_ku',
        'subtitle_en',
        'subtitle_ar',
        'subtitle_ku',
        'button_text_en',
        'button_text_ar',
        'button_text_ku',
        'button_link'
    ];
}
