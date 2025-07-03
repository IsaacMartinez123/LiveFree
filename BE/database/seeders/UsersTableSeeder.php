<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Juan Esteban Chanci',
                'email' => 'juanchanci123@example.com',
                'password' => Hash::make('1234'),
                'rol_id' => 1,
            ],
            [
                'name' => 'Isaac Martinez',
                'email' => 'isaac123@example.com',
                'password' => Hash::make('1234'),
                'rol_id' => 2,
            ],
        ]);
    }
}
