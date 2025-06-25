<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'reference', 'product_name', 'price', 'color',
        'size_S', 'size_M', 'size_L', 'size_XL', 'size_2XL', 'size_3XL', 'size_4XL', 'status'
    ];

    public function salesDetails()
    {
        return $this->hasMany(SalesDetail::class);
    }
}
