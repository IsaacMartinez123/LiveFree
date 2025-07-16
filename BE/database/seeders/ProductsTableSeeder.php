<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'reference' => 'REF001',
            'product_name' => 'Blusa Lunares',
            'price' => 20000,
            'color' => '#FF0000',
            'size_S' => 10,
            'size_M' => 5,
            'size_L' => 0,
            'size_XL' => 0,
            'size_2XL' => 0,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'status' => true,
        ]);
        Product::create([
            'reference' => 'REF002',
            'product_name' => 'Blusa Cuello V',
            'price' => 40000,
            'color' => '#0000FF',
            'size_S' => 0,
            'size_M' => 8,
            'size_L' => 2,
            'size_XL' => 0,
            'size_2XL' => 0,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'status' => true,
        ]);
    }
}
