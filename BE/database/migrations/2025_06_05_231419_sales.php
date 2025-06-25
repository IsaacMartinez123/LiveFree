<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('client_id')->constrained('clients');
            $table->foreignId('seller_id')->constrained('sellers');
            $table->foreignId('user_id')->constrained('users');
            $table->decimal('total', 10, 2);
            $table->date('date');
            $table->string('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales');
    }
};
