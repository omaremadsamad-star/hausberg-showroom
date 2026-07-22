<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('image_path');
            $table->string('title_en');
            $table->string('title_ar');
            $table->string('title_ku');
            $table->text('subtitle_en');
            $table->text('subtitle_ar');
            $table->text('subtitle_ku');
            $table->string('button_text_en');
            $table->string('button_text_ar');
            $table->string('button_text_ku');
            $table->string('button_link');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
