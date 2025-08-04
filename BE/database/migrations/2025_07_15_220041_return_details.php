<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('return_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_id')->constrained('returns')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            
            $table->integer('size_S')->default(0);
            $table->integer('size_M')->default(0);
            $table->integer('size_L')->default(0);
            $table->integer('size_XL')->default(0);
            $table->integer('size_2XL')->default(0);
            $table->integer('size_3XL')->default(0);
            $table->integer('size_4XL')->default(0);
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('return_details');
    }
};
