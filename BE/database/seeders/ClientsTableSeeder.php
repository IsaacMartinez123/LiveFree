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
        Client::create([
            'name' => 'Carlos Pérez',
            'document' => '777888999',
            'phone' => '3035556666',
            'address' => 'Avenida 7 #8-9',
            'city' => 'Cali',
            'store_name' => 'Tienda Carlos',
        ]);
        Client::create([
            'name' => 'Ana Torres',
            'document' => '101112131',
            'phone' => '3047778888',
            'address' => 'Diagonal 10 #11-12',
            'city' => 'Barranquilla',
            'store_name' => 'Tienda Ana',
        ]);

        Client::create([
            'name' => 'Luis Fernández',
            'document' => '141516171',
            'phone' => '3059990000',
            'address' => 'Transversal 14 #15-16',
            'city' => 'Cartagena',
            'store_name' => 'Tienda Luis',
        ]);

        Client::create([
            'name' => 'Sofía López',
            'document' => '181920212',
            'phone' => '3061112222',
            'address' => 'Calle 18 #19-20',
            'city' => 'Bucaramanga',
            'store_name' => 'Tienda Sofía',
        ]);
    }
}
