<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'ip_address',
        'username',
    ];
}
