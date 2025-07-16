<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class ClientsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Client::create([
            'name' => 'Isaac Martinez Isaza',
            'document' => '111222333',
            'phone' => '3011112222',
            'address' => 'Calle 1 #2-3',
            'city' => 'Medellín',
            'store_name' => 'Tienda Isaac',
        ]);
        Client::create([
            'name' => 'Laura Gómez',
            'document' => '444555666',
            'phone' => '3023334444',
            'address' => 'Carrera 4 #5-6',
            'city' => 'Bogotá',
            'store_name' => 'Tienda Laura',
        ]);
    }
}
