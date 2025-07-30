<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentDetail extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $fillable = [
        'payment_id', 'amount', 'payment_method', 'date', 'observations'
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
