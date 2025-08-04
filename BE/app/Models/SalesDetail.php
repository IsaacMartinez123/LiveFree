<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesDetail extends Model
{
    use HasFactory;

    protected $table = 'sales_detail';

    protected $fillable = [
        'sale_id', 'product_id', 'reference', 'product_name', 'price', 'color',
        'size_S', 'size_M', 'size_L', 'size_XL', 'size_2XL', 'size_3XL', 'size_4XL', 'sub_total',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
