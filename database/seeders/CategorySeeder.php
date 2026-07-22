<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Standard groups from JSON products
            [
                'name_en' => 'Kitchen Appliances',
                'name_ar' => 'أجهزة المطبخ',
                'name_ku' => 'ئامێرەکانی چێشتخانە',
            ],
            [
                'name_en' => 'Food Preparation',
                'name_ar' => 'تحضير الطعام',
                'name_ku' => 'ئامادەکردني خۆراك',
            ],
            [
                'name_en' => 'Cleaning',
                'name_ar' => 'أجهزة التنظيف',
                'name_ku' => 'پاککردنەوە',
            ],
            [
                'name_en' => 'Laundry',
                'name_ar' => 'العناية بالملابس',
                'name_ku' => 'جلشۆرین و ئوتوکردن',
            ],
            [
                'name_en' => 'Heating',
                'name_ar' => 'أجهزة التدفئة',
                'name_ku' => 'گەرمکردنەوە',
            ],
            [
                'name_en' => 'Cooling',
                'name_ar' => 'أجهزة التبريد',
                'name_ku' => 'ساردکردنەوە',
            ],
            
            // Additional example categories requested by user
            [
                'name_en' => 'TV',
                'name_ar' => 'تلفزيون',
                'name_ku' => 'تەلەفزیۆن',
            ],
            [
                'name_en' => 'Refrigerator',
                'name_ar' => 'ثلاجة',
                'name_ku' => 'سەلاجە',
            ],
            [
                'name_en' => 'Dryer',
                'name_ar' => 'مجفف',
                'name_ku' => 'وشککەرەوە',
            ],
            [
                'name_en' => 'Washing Machine',
                'name_ar' => 'غسالة ملابس',
                'name_ku' => 'غسالة جل',
            ],
            [
                'name_en' => 'Dishwasher',
                'name_ar' => 'غسالة صحون',
                'name_ku' => 'غسالة قاپ',
            ],
            [
                'name_en' => 'Oven',
                'name_ar' => 'فرن',
                'name_ku' => 'فرن',
            ],
            [
                'name_en' => 'Air Conditioner',
                'name_ar' => 'مكيف هواء',
                'name_ku' => 'مكيف',
            ],
            [
                'name_en' => 'Microwave',
                'name_ar' => 'مايكروويف',
                'name_ku' => 'مايكروويف',
            ],
            [
                'name_en' => 'Vacuum Cleaner',
                'name_ar' => 'مكنسة كهربائية',
                'name_ku' => 'گسکی کارەبایی',
            ],
            [
                'name_en' => 'Coffee Machine',
                'name_ar' => 'صانعة قهوة',
                'name_ku' => 'قاوە دروستکەر',
            ]
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name_en'])],
                [
                    'name_en' => $cat['name_en'],
                    'name_ar' => $cat['name_ar'],
                    'name_ku' => $cat['name_ku'],
                ]
            );
        }
    }
}
