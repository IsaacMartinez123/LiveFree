<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sales_detail', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('reference');
            $table->string('product_name');
            $table->decimal('price', 10, 2);
            $table->string('color');

            // Cantidades vendidas por talla
            $table->integer('size_S');
            $table->integer('size_M');
            $table->integer('size_L');
            $table->integer('size_XL');
            $table->integer('size_2XL');
            $table->integer('size_3XL');
            $table->integer('size_4XL');
            $table->integer('sub_total');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales_detail');
    }
};
