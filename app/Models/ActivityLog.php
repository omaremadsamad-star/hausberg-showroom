<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    // Table doesn't have updated_at column, only created_at
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'admin_name',
        'username',
        'action',
        'ip_address',
        'user_agent'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
