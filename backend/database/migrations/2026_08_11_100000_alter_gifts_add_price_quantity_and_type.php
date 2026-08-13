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
        Schema::table('gifts', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->nullable()->after('description');
            $table->unsignedInteger('quantity')->default(1)->after('price');
            $table->boolean('is_free_amount')->default(false)->after('quantity');
            $table->dropColumn('is_reserved');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gifts', function (Blueprint $table) {
            $table->boolean('is_reserved')->default(false);
            $table->dropColumn(['price', 'quantity', 'is_free_amount']);
        });
    }
};
