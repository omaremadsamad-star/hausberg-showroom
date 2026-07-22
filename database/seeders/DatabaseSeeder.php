<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create default administrator
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Hausberg Administrator',
                'email' => 'admin@hausberg.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'status' => 'Active',
            ]
        );

        // 2. Call seeders
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
