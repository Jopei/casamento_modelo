<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wedding_settings', function (Blueprint $table) {
            $table->id();
            $table->string('bride_name');
            $table->string('groom_name');
            $table->dateTime('wedding_date');
            $table->string('hero_image_path')->nullable();
            $table->text('welcome_message')->nullable();
            $table->string('location_name')->nullable();
            $table->string('location_address')->nullable();
            $table->string('location_map_embed_url')->nullable();
            $table->string('location_directions_url')->nullable();
            $table->text('dress_code_text')->nullable();
            $table->json('dress_code_colors')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wedding_settings');
    }
};
