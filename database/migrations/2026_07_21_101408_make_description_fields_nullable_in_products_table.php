<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('description_en')->nullable()->change();
            $table->text('description_ar')->nullable()->change();
            $table->text('description_ku')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('description_en')->nullable(false)->change();
            $table->text('description_ar')->nullable(false)->change();
            $table->text('description_ku')->nullable(false)->change();
        });
    }
};
