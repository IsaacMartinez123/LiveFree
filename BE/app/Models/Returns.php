<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Returns extends Model
{
    use HasFactory;

    protected $table = 'returns';

    protected $fillable = [
        'user_id',
        'client_id',
        'return_number',
        'refund_total',
        'return_date',
        'refund_date',
        'reason',
        'status',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(ReturnDetail::class, 'return_id');
    }
}
