<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnDetail extends Model
{
    use HasFactory;

    protected $table = 'return_details';

    public $timestamps = false;

    protected $fillable = [
        'return_id',
        'product_id',
        'reference',
        'product_name',
        'price',
        'color',
        'amount',
        'sub_total',
    ];

    public function return()
    {
        return $this->belongsTo(Returns::class, 'return_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
