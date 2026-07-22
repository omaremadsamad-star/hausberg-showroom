<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'whatsapp_number',
        'phone_number',
        'email',
        'address_en',
        'address_ar',
        'address_ku',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'youtube_url',
        'maintenance_mode'
    ];

    protected $casts = [
        'maintenance_mode' => 'boolean'
    ];
}
