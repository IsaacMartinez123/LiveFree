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

            // Campos auxiliares para devoluciones
            $table->integer('returned_S')->default(0);
            $table->integer('returned_M')->default(0);
            $table->integer('returned_L')->default(0);
            $table->integer('returned_XL')->default(0);
            $table->integer('returned_2XL')->default(0);
            $table->integer('returned_3XL')->default(0);
            $table->integer('returned_4XL')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales_detail');
    }
};
