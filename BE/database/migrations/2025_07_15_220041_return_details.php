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
            $table->string('reference');
            $table->string('product_name');
            $table->decimal('price', 10, 2);
            $table->string('color');
            $table->integer('amount')->default(0);
            $table->integer('sub_total');
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('return_details');
    }
};
