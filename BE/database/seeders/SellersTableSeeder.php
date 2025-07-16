<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seller;

class SellersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Seller::create([
            'name' => 'Alejandro',
            'document' => '123456789',
            'phone' => '3001112233',
            'seller_code' => 'SELL01',
        ]);
        Seller::create([
            'name' => 'Maria',
            'document' => '987654321',
            'phone' => '3004445566',
            'seller_code' => 'SELL02',
        ]);
    }
}
