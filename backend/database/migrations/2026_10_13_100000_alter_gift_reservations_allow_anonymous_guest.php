<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Reserva sem convidado identificado: guest_id passa a aceitar NULL.
        // A FK e o unique(gift_id, guest_id) nao sao tocados (o unique sustenta
        // a FK de gift_id no MySQL e aceita varias linhas com guest_id NULL).
        // As reservas existentes continuam intactas.
        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->unsignedBigInteger('guest_id')->nullable()->change();
            $table->string('giver_name', 80)->nullable()->after('guest_id');
            // sha256 do token de cancelamento; nunca o token puro.
            $table->char('cancel_token_hash', 64)->nullable()->after('giver_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nao apaga nem corrompe dados: se houver reserva anonima, aborta.
        if (DB::table('gift_reservations')->whereNull('guest_id')->exists()) {
            throw new RuntimeException(
                'Rollback abortado: existem reservas com guest_id NULL. '
                .'Remova ou associe um convidado a elas antes de reverter.'
            );
        }

        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->dropColumn(['giver_name', 'cancel_token_hash']);
        });

        Schema::table('gift_reservations', function (Blueprint $table) {
            $table->unsignedBigInteger('guest_id')->nullable(false)->change();
        });
    }
};
