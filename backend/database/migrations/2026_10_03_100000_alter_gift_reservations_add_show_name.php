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
        // Migration aditiva: o default false preserva o anonimato das reservas
        // que ja existem, pois esses convidados nunca consentiram em exibir o nome.
        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->boolean('show_name')->default(false)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->dropColumn('show_name');
        });
    }
};
