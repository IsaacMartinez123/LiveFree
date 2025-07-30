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
        // Venta 1
        $sale1 = Sale::create([
            'invoice_number' => '4050',
            'client_id' => 1,
            'seller_id' => 1,
            'user_id' => 1,
            'total' => 60000,
            'status' => 'despachada',
        ]);
        SalesDetail::create([
            'sale_id' => $sale1->id,
            'product_id' => 1,
            'reference' => 'REF001',
            'product_name' => 'Blusa Lunares',
            'price' => 20000,
            'color' => '#FF0000',
            'size_S' => 1,
            'size_M' => 2,
            'size_L' => 0,
            'size_XL' => 0,
            'size_2XL' => 0,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'sub_total' => 60000,
            'returned_S' => 0,
            'returned_M' => 0,
            'returned_L' => 0,
            'returned_XL' => 0,
            'returned_2XL' => 0,
            'returned_3XL' => 0,
            'returned_4XL' => 0,
        ]);
        SalesDetail::create([
            'sale_id' => $sale1->id,
            'product_id' => 2,
            'reference' => 'REF002',
            'product_name' => 'Blusa Cuello V',
            'price' => 40000,
            'color' => '#0000FF',
            'size_S' => 0,
            'size_M' => 1,
            'size_L' => 1,
            'size_XL' => 0,
            'size_2XL' => 0,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'sub_total' => 80000,
            'returned_S' => 0,
            'returned_M' => 0,
            'returned_L' => 0,
            'returned_XL' => 0,
            'returned_2XL' => 0,
            'returned_3XL' => 0,
            'returned_4XL' => 0,
        ]);

        // Venta 2
        $sale2 = Sale::create([
            'invoice_number' => '4051',
            'client_id' => 2,
            'seller_id' => 2,
            'user_id' => 1,
            'total' => 40000,
            'status' => 'pendiente',
        ]);
        SalesDetail::create([
            'sale_id' => $sale2->id,
            'product_id' => 2,
            'reference' => 'REF002',
            'product_name' => 'Blusa Cuello V',
            'price' => 40000,
            'color' => '#0000FF',
            'size_S' => 0,
            'size_M' => 2,
            'size_L' => 2,
            'size_XL' => 0,
            'size_2XL' => 0,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'sub_total' => 16000,
            'returned_S' => 0,
            'returned_M' => 0,
            'returned_L' => 0,
            'returned_XL' => 0,
            'returned_2XL' => 0,
            'returned_3XL' => 0,
            'returned_4XL' => 0,
        ]);
    }
}
