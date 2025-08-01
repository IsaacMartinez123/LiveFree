<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('document')->unique();
            $table->string('phone');
            $table->string('address');
            $table->string('city');
            $table->string('store_name')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('clients');
    }
};
