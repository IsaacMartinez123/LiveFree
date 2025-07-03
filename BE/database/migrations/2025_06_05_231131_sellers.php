<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('document')->unique();
            $table->string('phone');
            $table->string('seller_code')->unique();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sellers');
    }
};
