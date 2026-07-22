<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'company_name' => $this->company_name,
            'whatsapp_number' => $this->whatsapp_number,
            'phone_number' => $this->phone_number,
            'email' => $this->email,
            'address' => [
                'en' => $this->address_en,
                'ar' => $this->address_ar,
                'ku' => $this->address_ku,
            ],
            'socials' => [
                'facebook' => $this->facebook_url,
                'instagram' => $this->instagram_url,
                'twitter' => $this->twitter_url,
                'youtube' => $this->youtube_url,
            ],
            'maintenance_mode' => (bool)$this->maintenance_mode
        ];
    }
}
