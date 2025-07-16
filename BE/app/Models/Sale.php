<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number', 'client_id', 'seller_id', 'user_id', 'total', 'status'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function salesDetails()
    {
        return $this->hasMany(SalesDetail::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'sales_id');
    }
}
