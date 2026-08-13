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
        Schema::table('wedding_settings', function (Blueprint $table) {
            $table->string('pix_key')->nullable();
            $table->string('pix_key_type', 20)->nullable();
            // Limites definidos pelo padrao BR Code do Banco Central.
            $table->string('pix_merchant_name', 25)->nullable();
            $table->string('pix_city', 15)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wedding_settings', function (Blueprint $table) {
            $table->dropColumn(['pix_key', 'pix_key_type', 'pix_merchant_name', 'pix_city']);
        });
    }
};
