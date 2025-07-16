<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnDetail extends Model
{
    use HasFactory;

    protected $table = 'return_details';

    protected $fillable = [
        'return_id',
        'product_id',
        'size_S',
        'size_M',
        'size_L',
        'size_XL',
        'size_2XL',
        'size_3XL',
        'size_4XL',
        'reason',
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
