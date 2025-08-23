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
        Seller::create([
            'name' => 'Carlos',
            'document' => '456789123',
            'phone' => '3007778899',
            'seller_code' => 'SELL03',
        ]);
        Seller::create([
            'name' => 'Laura',
            'document' => '321654987',
            'phone' => '3002223344',
            'seller_code' => 'SELL04',
        ]);
        Seller::create([
            'name' => 'Javier',
            'document' => '654321789',
            'phone' => '3005556677',
            'seller_code' => 'SELL05',
        ]);
        Seller::create([
            'name' => 'Sofia',
            'document' => '789123456',
            'phone' => '3008889900',
            'seller_code' => 'SELL06',
        ]);
        Seller::create([
            'name' => 'Andres',
            'document' => '159753486',
            'phone' => '3001234567',
            'seller_code' => 'SELL07',
        ]);
        Seller::create([
            'name' => 'Camila',
            'document' => '753159852',
            'phone' => '3007654321',
            'seller_code' => 'SELL08',
        ]);

        Seller::create([
            'name' => 'Diego',
            'document' => '852963741',
            'phone' => '3002468135',
            'seller_code' => 'SELL09',
        ]);

        Seller::create([
            'name' => 'Valentina',
            'document' => '369258147',
            'phone' => '3001357924',
            'seller_code' => 'SELL10',
        ]);
    }
}
