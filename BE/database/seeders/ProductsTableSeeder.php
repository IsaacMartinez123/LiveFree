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
            'status' => 'disponible',
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
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF003',
            'product_name' => 'Camiseta Básica',
            'price' => 15000,
            'color' => '#00FF00',
            'size_S' => 7,
            'size_M' => 10,
            'size_L' => 5,
            'size_XL' => 2,
            'size_2XL' => 1,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF004',
            'product_name' => 'Camisa Manga Larga',
            'price' => 35000,
            'color' => '#FFA500',
            'size_S' => 3,
            'size_M' => 6,
            'size_L' => 4,
            'size_XL' => 2,
            'size_2XL' => 1,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF005',
            'product_name' => 'Pantalón Jeans',
            'price' => 50000,
            'color' => '#000000',
            'size_S' => 2,
            'size_M' => 4,
            'size_L' => 6,
            'size_XL' => 3,
            'size_2XL' => 2,
            'size_3XL' => 1,
            'size_4XL' => 0,
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF006',
            'product_name' => 'Falda Plisada',
            'price' => 25000,
            'color' => '#FFC0CB',
            'size_S' => 5,
            'size_M' => 7,
            'size_L' => 3,
            'size_XL' => 2,
            'size_2XL' => 0,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF007',
            'product_name' => 'Vestido Largo',
            'price' => 60000,
            'color' => '#800080',
            'size_S' => 1,
            'size_M' => 2,
            'size_L' => 2,
            'size_XL' => 2,
            'size_2XL' => 1,
            'size_3XL' => 1,
            'size_4XL' => 0,
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF008',
            'product_name' => 'Short Deportivo',
            'price' => 18000,
            'color' => '#808080',
            'size_S' => 8,
            'size_M' => 6,
            'size_L' => 4,
            'size_XL' => 2,
            'size_2XL' => 1,
            'size_3XL' => 0,
            'size_4XL' => 0,
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF009',
            'product_name' => 'Chaqueta Impermeable',
            'price' => 70000,
            'color' => '#008080',
            'size_S' => 2,
            'size_M' => 3,
            'size_L' => 3,
            'size_XL' => 2,
            'size_2XL' => 1,
            'size_3XL' => 1,
            'size_4XL' => 1,
            'status' => 'disponible',
        ]);
        Product::create([
            'reference' => 'REF010',
            'product_name' => 'Sudadera Algodón',
            'price' => 45000,
            'color' => '#A52A2A',
            'size_S' => 4,
            'size_M' => 5,
            'size_L' => 6,
            'size_XL' => 3,
            'size_2XL' => 2,
            'size_3XL' => 1,
            'size_4XL' => 1,
            'status' => 'disponible',
        ]);
    }
}
