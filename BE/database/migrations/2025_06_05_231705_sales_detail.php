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
            $table->foreignId('sale_id')->constrained('sales');
            $table->foreignId('product_id')->constrained('products');
            $table->string('product_name');
            $table->decimal('price', 10, 2);
            $table->string('color');
            $table->integer('size_S');
            $table->integer('size_M');
            $table->integer('size_L');
            $table->integer('size_XL');
            $table->integer('size_2XL');
            $table->integer('size_3XL');
            $table->integer('size_4XL');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales_detail');
    }
};
