<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;
use App\Models\Banner;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Settings
        Setting::updateOrCreate(
            ['id' => 1],
            [
                'company_name' => 'Hausberg',
                'whatsapp_number' => '9647509648944',
                'phone_number' => '0750 964 8944',
                'email' => 'showroom@hausberg-appliances.com',
                'address_en' => 'Royal Mall, Erbil, Kurdistan',
                'address_ar' => 'رويال مول، أربيل، كوردستان',
                'address_ku' => 'ڕۆیاڵ مۆڵ، هەولێر، کوردستان',
                'facebook_url' => 'https://facebook.com/hausberg',
                'instagram_url' => 'https://instagram.com/hausberg',
                'twitter_url' => 'https://twitter.com/hausberg',
                'youtube_url' => 'https://youtube.com/hausberg',
                'maintenance_mode' => false
            ]
        );

        // Seed homepage hero banner
        Banner::updateOrCreate(
            ['id' => 1],
            [
                'image_path' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1920&auto=format&fit=crop',
                'title_en' => 'Premium Home Appliances',
                'title_ar' => 'أجهزة منزلية فاخرة',
                'title_ku' => 'ئامێرە نایابەکانی ماڵەوە',
                'subtitle_en' => 'Experience the pinnacle of engineering and minimalist design. Hausberg brings intelligent technology, reliable efficiency, and modern luxury into your everyday living space.',
                'subtitle_ar' => 'اختبر قمة الهندسة والتصميم البسيط. تجلب هاوسبيرغ التكنولوجيا الذكية والفعالية الموثوقة والفخامة العصرية إلى مساحة معيشتك اليومية.',
                'subtitle_ku' => 'لووتکەی ئەندازیاری و دیزاینی سادە و مۆدێرن ئەزموون بکە. هاوسبێرگ تەکنەلۆژیای زیرەک، کارایی باوەڕپێکراو، و خۆشگوزەرانی مۆدێرن دەهێنێتە ناو شوێنی ژیانی ڕۆژانەتەوە.',
                'button_text_en' => 'Explore Products',
                'button_text_ar' => 'استكشف المنتجات',
                'button_text_ku' => 'گەڕان لە بەرهەمەکان',
                'button_link' => '#products-section'
            ]
        );
    }
}
