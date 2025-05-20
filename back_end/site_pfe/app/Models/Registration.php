<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_id',
        'parent_name',
        'parent_email',
        'parent_phone',
        'address',
        'city',
        'postal_code',
        'player_phone',
        'player_email',
        'documents',
        'payment_method',
        'status',
        'payment_status',
        'payment_reference',
        'payment_justification'
    ];

    protected $casts = [
        'documents' => 'array',
    ];

    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
