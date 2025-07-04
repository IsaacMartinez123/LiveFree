<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'document',
        'phone',
        'seller_code'
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
