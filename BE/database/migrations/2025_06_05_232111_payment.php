<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_id')->constrained('sales');
            $table->foreignId('client_id')->constrained('clients');
            $table->string('invoice_number')->unique();
            $table->decimal('total_debt', 10, 2);
            $table->decimal('total_payment', 10, 2);
            $table->enum('status', ['pendiente', 'pagado', 'cancelado', 'sobrepagado'])->default('pendiente');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};
