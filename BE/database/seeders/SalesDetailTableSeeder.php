<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SalesDetail;

class SalesDetailTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Seeding with data from the provided image
        // The sub_total is calculated based on the price and the sum of all sizes.
        
        SalesDetail::create([
            'sale_id' => 1,
            'product_id' => 1,
            'reference' => 'REF001',
            'product_name' => 'Blusa Lunares',
            'price' => 20000,
            'color' => '#0000FF',
            'size_S' => 5,
            'size_M' => 5,
            'size_L' => 5,
            'size_XL' => 5,
            'size_2XL' => 5,
            'size_3XL' => 5,
            'size_4XL' => 5,
            'sub_total' => 105000, // 20000 * (5+5)
        ]);
        
        SalesDetail::create([
            'sale_id' => 1,
            'product_id' => 2,
            'reference' => 'REF002',
            'product_name' => 'Blusa Cuello V',
            'price' => 30000,
            'color' => '#0000FF',
            'size_S' => 5,
            'size_M' => 5,
            'size_L' => 5,
            'size_XL' => 5,
            'size_2XL' => 5,
            'size_3XL' => 5,
            'size_4XL' => 5,
            'sub_total' => 150000, // 30000 * (5+5)
        ]);

        // Sale ID: 2, 3, 15, 14
        SalesDetail::create([
            'sale_id' => 2,
            'product_id' => 3,
            'reference' => 'REF003',
            'product_name' => 'Camiseta Basica',
            'price' => 15000,
            'color' => '#00FF00',
            'size_S' => 5,
            'size_M' => 5,
            'size_L' => 5,
            'size_XL' => 5,
            'size_2XL' => 5,
            'size_3XL' => 5,
            'size_4XL' => 5,
            'sub_total' => 75000, // 15000 * (5)
        ]);

        // ... and so on for all the rows in the image.
        // The total number of items is the sum of sizes (e.g., 5+5+5+5+5+5+5=35)
        // sub_total = price * (sum of sizes)
        
        $details = [
            [
                'sale_id' => 1,
                'product_id' => 1,
                'reference' => 'REF001',
                'product_name' => 'Blusa Lunares',
                'price' => 20000,
                'color' => '#0000FF',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 105000
            ],
            [
                'sale_id' => 1,
                'product_id' => 2,
                'reference' => 'REF002',
                'product_name' => 'Blusa Cuello V',
                'price' => 30000,
                'color' => '#0000FF',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 150000
            ],
            [
                'sale_id' => 2,
                'product_id' => 3,
                'reference' => 'REF003',
                'product_name' => 'Camiseta Basica',
                'price' => 15000,
                'color' => '#00FF00',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 75000
            ],
            [
                'sale_id' => 2,
                'product_id' => 4,
                'reference' => 'REF004',
                'product_name' => 'Camisa Manga Larga',
                'price' => 35000,
                'color' => '#FF0000',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 125000
            ],
            [
                'sale_id' => 2,
                'product_id' => 5,
                'reference' => 'REF005',
                'product_name' => 'Pantalón Jeans',
                'price' => 45000,
                'color' => '#000000',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 1575000
            ],
            [
                'sale_id' => 2,
                'product_id' => 6,
                'reference' => 'REF006',
                'product_name' => 'Falda Plisada',
                'price' => 25000,
                'color' => '#FFCCDB',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 875000
            ],
            [
                'sale_id' => 3,
                'product_id' => 7,
                'reference' => 'REF007',
                'product_name' => 'Vestido Largo',
                'price' => 30000,
                'color' => '#000000',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 1050000
            ],
            [
                'sale_id' => 3,
                'product_id' => 8,
                'reference' => 'REF008',
                'product_name' => 'Short Deportivo',
                'price' => 1000,
                'color' => '#000080',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 630000
            ],
            [
                'sale_id' => 3,
                'product_id' => 9,
                'reference' => 'REF009',
                'product_name' => 'Chaqueta Impermeable',
                'price' => 40000,
                'color' => '#008080',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 1400000
            ],
            [
                'sale_id' => 4,
                'product_id' => 10,
                'reference' => 'REF010',
                'product_name' => 'Sudadera Algodón',
                'price' => 35000,
                'color' => '#A52A2A',
                'sizes' => [5, 5, 5, 5, 5, 5, 5],
                'sub_total' => 1225000
            ],
            [
                'sale_id' => 5,
                'product_id' => 1,
                'reference' => 'REF001',
                'product_name' => 'Blusa Lunares',
                'price' => 20000,
                'color' => '#FF0000',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 420000
            ],
            [
                'sale_id' => 5,
                'product_id' => 2,
                'reference' => 'REF002',
                'product_name' => 'Blusa Cuello V',
                'price' => 30000,
                'color' => '#0000FF',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 630000
            ],
            [
                'sale_id' => 5,
                'product_id' => 10,
                'reference' => 'REF010',
                'product_name' => 'Sudadera Algodón',
                'price' => 35000,
                'color' => '#A52A2A',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 735000
            ],
            [
                'sale_id' => 6,
                'product_id' => 9,
                'reference' => 'REF009',
                'product_name' => 'Chaqueta Impermeable',
                'price' => 40000,
                'color' => '#008080',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 840000
            ],
            [
                'sale_id' => 7,
                'product_id' => 8,
                'reference' => 'REF008',
                'product_name' => 'Short Deportivo',
                'price' => 1000,
                'color' => '#000080',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 378000
            ],
            [
                'sale_id' => 8,
                'product_id' => 7,
                'reference' => 'REF007',
                'product_name' => 'Vestido Largo',
                'price' => 30000,
                'color' => '#000000',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 630000
            ],
            [
                'sale_id' => 9,
                'product_id' => 3,
                'reference' => 'REF003',
                'product_name' => 'Camiseta Basica',
                'price' => 15000,
                'color' => '#00FF00',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 315000
            ],
            [
                'sale_id' => 10,
                'product_id' => 4,
                'reference' => 'REF004',
                'product_name' => 'Camisa Manga Larga',
                'price' => 35000,
                'color' => '#FF0000',
                'sizes' => [3, 3, 3, 3, 3, 3, 3],
                'sub_total' => 735000
            ],
            [
                'sale_id' => 11,
                'product_id' => 8,
                'reference' => 'REF008',
                'product_name' => 'Short Deportivo',
                'price' => 1000,
                'color' => '#000080',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 252000
            ],
            [
                'sale_id' => 12,
                'product_id' => 10,
                'reference' => 'REF010',
                'product_name' => 'Sudadera Algodón',
                'price' => 35000,
                'color' => '#A52A2A',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 490000
            ],
            [
                'sale_id' => 13,
                'product_id' => 7,
                'reference' => 'REF007',
                'product_name' => 'Vestido Largo',
                'price' => 30000,
                'color' => '#000000',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 420000
            ],
            [
                'sale_id' => 2,
                'product_id' => 9,
                'reference' => 'REF009',
                'product_name' => 'Chaqueta Impermeable',
                'price' => 40000,
                'color' => '#008080',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 560000
            ],
            [
                'sale_id' => 2,
                'product_id' => 2,
                'reference' => 'REF002',
                'product_name' => 'Blusa Cuello V',
                'price' => 30000,
                'color' => '#0000FF',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 420000
            ],
            [
                'sale_id' => 4,
                'product_id' => 4,
                'reference' => 'REF004',
                'product_name' => 'Camisa Manga Larga',
                'price' => 35000,
                'color' => '#FF0000',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 490000
            ],
            [
                'sale_id' => 10,
                'product_id' => 6,
                'reference' => 'REF006',
                'product_name' => 'Falda Plisada',
                'price' => 25000,
                'color' => '#FFCCDB',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 350000
            ],
            [
                'sale_id' => 11,
                'product_id' => 1,
                'reference' => 'REF001',
                'product_name' => 'Blusa Lunares',
                'price' => 20000,
                'color' => '#0000FF',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 280000
            ],
            [
                'sale_id' => 12,
                'product_id' => 3,
                'reference' => 'REF003',
                'product_name' => 'Camiseta Basica',
                'price' => 15000,
                'color' => '#00FF00',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 210000
            ],
            [
                'sale_id' => 13,
                'product_id' => 5,
                'reference' => 'REF005',
                'product_name' => 'Pantalón Jeans',
                'price' => 45000,
                'color' => '#000000',
                'sizes' => [2, 2, 2, 2, 2, 2, 2],
                'sub_total' => 630000
            ],
            [
                'sale_id' => 13,
                'product_id' => 8,
                'reference' => 'REF008',
                'product_name' => 'Short Deportivo',
                'price' => 1000,
                'color' => '#000080',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 126000
            ],
            [
                'sale_id' => 14,
                'product_id' => 7,
                'reference' => 'REF007',
                'product_name' => 'Vestido Largo',
                'price' => 30000,
                'color' => '#000000',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 210000
            ],
            [
                'sale_id' => 15,
                'product_id' => 6,
                'reference' => 'REF006',
                'product_name' => 'Falda Plisada',
                'price' => 25000,
                'color' => '#FFCCDB',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 25000
            ],
            [
                'sale_id' => 16,
                'product_id' => 5,
                'reference' => 'REF005',
                'product_name' => 'Pantalón Jeans',
                'price' => 45000,
                'color' => '#000000',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 315000
            ],
            [
                'sale_id' => 17,
                'product_id' => 4,
                'reference' => 'REF004',
                'product_name' => 'Camisa Manga Larga',
                'price' => 35000,
                'color' => '#FF0000',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 245000
            ],
            [
                'sale_id' => 18,
                'product_id' => 3,
                'reference' => 'REF003',
                'product_name' => 'Camiseta Basica',
                'price' => 15000,
                'color' => '#00FF00',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 105000
            ],
            [
                'sale_id' => 18,
                'product_id' => 2,
                'reference' => 'REF002',
                'product_name' => 'Blusa Cuello V',
                'price' => 30000,
                'color' => '#0000FF',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 210000
            ],
            [
                'sale_id' => 15,
                'product_id' => 1,
                'reference' => 'REF001',
                'product_name' => 'Blusa Lunares',
                'price' => 20000,
                'color' => '#0000FF',
                'sizes' => [1, 1, 1, 1, 1, 1, 1],
                'sub_total' => 140000
            ],
        ];

        foreach ($details as $detail) {
            $totalSizes = array_sum($detail['sizes']);
            $subTotal = $detail['price'] * $totalSizes;
            SalesDetail::create([
                'sale_id' => $detail['sale_id'],
                'product_id' => $detail['product_id'],
                'reference' => $detail['reference'],
                'product_name' => $detail['product_name'],
                'price' => $detail['price'],
                'color' => $detail['color'],
                'size_S' => $detail['sizes'][0],
                'size_M' => $detail['sizes'][1],
                'size_L' => $detail['sizes'][2],
                'size_XL' => $detail['sizes'][3],
                'size_2XL' => $detail['sizes'][4],
                'size_3XL' => $detail['sizes'][5],
                'size_4XL' => $detail['sizes'][6],
                'sub_total' => $subTotal,
            ]);
        }
    }
}
