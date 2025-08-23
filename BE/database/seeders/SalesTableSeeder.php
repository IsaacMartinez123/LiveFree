<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\SalesDetail;

class SalesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sale::create([
            'invoice_number' => '4050',
            'client_id' => 1,
            'seller_id' => 1,
            'user_id' => 1,
            'total' => 60000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4051',
            'client_id' => 2,
            'seller_id' => 2,
            'user_id' => 1,
            'total' => 40000,
            'status' => 'pendiente',
        ]);
        
        Sale::create([
            'invoice_number' => '4052',
            'client_id' => 3,
            'seller_id' => 1,
            'user_id' => 1,
            'total' => 80000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4053',
            'client_id' => 4,
            'seller_id' => 2,
            'user_id' => 1,
            'total' => 50000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4054',
            'client_id' => 5,
            'seller_id' => 1,
            'user_id' => 1,
            'total' => 70000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4055',
            'client_id' => 6,
            'seller_id' => 2,
            'user_id' => 1,
            'total' => 30000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4056',
            'client_id' => 6,
            'seller_id' => 1,
            'user_id' => 1,
            'total' => 90000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4057',
            'client_id' => 3,
            'seller_id' => 3,
            'user_id' => 1,
            'total' => 55000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4058',
            'client_id' => 4,
            'seller_id' => 3,
            'user_id' => 1,
            'total' => 65000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4059',
            'client_id' => 2,
            'seller_id' => 5,
            'user_id' => 1,
            'total' => 75000,
            'status' => 'pendiente',
        ]);
        
        Sale::create([
            'invoice_number' => '4060',
            'client_id' => 5,
            'seller_id' => 5,
            'user_id' => 1,
            'total' => 85000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4061',
            'client_id' => 4,
            'seller_id' => 4,
            'user_id' => 1,
            'total' => 95000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4062',
            'client_id' => 4,
            'seller_id' => 4,
            'user_id' => 1,
            'total' => 105000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4063',
            'client_id' => 6,
            'seller_id' => 5,
            'user_id' => 1,
            'total' => 115000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4064',
            'client_id' => 3,
            'seller_id' => 3,
            'user_id' => 1,
            'total' => 125000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4065',
            'client_id' => 6,
            'seller_id' => 3,
            'user_id' => 1,
            'total' => 135000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4066',
            'client_id' => 5,
            'seller_id' => 5,
            'user_id' => 1,
            'total' => 145000,
            'status' => 'pendiente',
        ]);

        Sale::create([
            'invoice_number' => '4067',
            'client_id' => 3,
            'seller_id' => 6,
            'user_id' => 1,
            'total' => 155000,
            'status' => 'pendiente',
        ]);

    }
}
