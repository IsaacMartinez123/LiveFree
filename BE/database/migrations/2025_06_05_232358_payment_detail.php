<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments');
            $table->decimal('amount', 10, 2);
            $table->string('payment_method');
            $table->date('date');
            $table->string('observations')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_details');
    }
};
