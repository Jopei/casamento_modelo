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
        // No MySQL o indice unique de gift_id sustenta a foreign key, entao a
        // ordem importa: soltar a FK primeiro, depois o unique, e so entao
        // recriar a FK apoiada no novo indice composto.
        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->dropForeign(['gift_id']);
        });

        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->dropUnique(['gift_id']);
        });

        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->default(0)->after('guest_id');
            $table->string('status')->default('pending')->after('amount');
            $table->timestamp('paid_at')->nullable()->after('reserved_at');

            // Uma unidade por convidado em cada presente. gift_id e a coluna
            // mais a esquerda, entao este indice tambem serve a foreign key.
            $table->unique(['gift_id', 'guest_id']);
            $table->foreign('gift_id')->references('id')->on('gifts')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->dropForeign(['gift_id']);
        });

        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->dropUnique(['gift_id', 'guest_id']);
            $table->dropColumn(['amount', 'status', 'paid_at']);
        });

        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->unique('gift_id');
            $table->foreign('gift_id')->references('id')->on('gifts')->cascadeOnDelete();
        });
    }
};
