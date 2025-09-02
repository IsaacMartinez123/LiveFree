<?php

namespace Database\Seeders;

use App\Models\label;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LabelsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        label::create([
            'name' => 'LIVE FREE',
            'document' => '98.624.755',
            'address' => 'CALLE 18 # 71 - 24 BELEN LAS PLAYAS',
            'phone' => '3206823281',
            'responsible' => 'SAMUEL CARDONA',
            'city' => 'MEDELLIN - ANTIOQUIA',
        ]);
    }
}
