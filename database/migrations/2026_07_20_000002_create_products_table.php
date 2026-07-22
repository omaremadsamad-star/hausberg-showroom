<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict')->index();
            $table->string('slug')->unique()->index();
            $table->string('sku')->index();
            $table->string('brand')->default('Hausberg');
            $table->string('model')->index();
            $table->string('name_en');
            $table->string('name_ar');
            $table->string('name_ku');
            $table->decimal('price', 12, 2);
            $table->decimal('discount_price', 12, 2)->nullable();
            $table->integer('discount_percentage')->nullable();
            $table->timestamp('discount_start_date')->nullable();
            $table->timestamp('discount_end_date')->nullable();
            $table->text('description_en');
            $table->text('description_ar');
            $table->text('description_ku');
            $table->enum('availability_status', ['Available', 'Out Of Stock', 'Coming Soon', 'Discontinued'])->default('Available')->index();
            $table->boolean('featured')->default(false)->index();
            $table->enum('status', ['Draft', 'Published'])->default('Draft')->index();
            $table->integer('display_order')->default(0)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
