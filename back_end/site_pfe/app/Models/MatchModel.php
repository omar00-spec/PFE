<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchModel extends Model
{
    protected $table = 'matches_models';

    protected $fillable = ['category_id', 'date', 'opponent', 'location', 'result'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
