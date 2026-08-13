<?php

namespace App\Support;

use App\Models\WeddingSetting;

/**
 * Monta o "copia e cola" do PIX (BR Code EMV, padrao do Banco Central).
 *
 * Cada campo segue o formato ID + tamanho com 2 digitos + valor, e o
 * payload termina com o CRC16-CCITT-FALSE calculado sobre a string toda,
 * ja incluindo o marcador "6304".
 */
class PixPayload
{
    private const GUI = 'BR.GOV.BCB.PIX';

    public static function build(
        string $key,
        string $merchantName,
        string $city,
        float $amount,
        string $txid = '***',
    ): string {
        $merchantAccount = self::field('00', self::GUI).self::field('01', $key);

        $payload = self::field('00', '01')
            .self::field('26', $merchantAccount)
            .self::field('52', '0000')
            .self::field('53', '986')
            .self::field('54', number_format($amount, 2, '.', ''))
            .self::field('58', 'BR')
            .self::field('59', self::sanitize($merchantName, 25))
            .self::field('60', self::sanitize($city, 15))
            .self::field('62', self::field('05', self::sanitizeTxid($txid)))
            .'6304';

        return $payload.self::crc16($payload);
    }

    /**
     * Gera o payload a partir das configuracoes do casamento.
     * Retorna null quando o casal ainda nao cadastrou a chave PIX.
     */
    public static function forSettings(WeddingSetting $settings, float $amount, string $txid = '***'): ?string
    {
        if (blank($settings->pix_key)) {
            return null;
        }

        $merchantName = $settings->pix_merchant_name
            ?: trim($settings->groom_name.' '.$settings->bride_name);

        return self::build(
            $settings->pix_key,
            $merchantName,
            $settings->pix_city ?: 'BRASIL',
            $amount,
            $txid,
        );
    }

    private static function field(string $id, string $value): string
    {
        return $id.str_pad((string) mb_strlen($value), 2, '0', STR_PAD_LEFT).$value;
    }

    /**
     * O BR Code aceita apenas ASCII imprimivel nos campos de texto, entao
     * acentos viram a letra base e o restante e descartado.
     */
    private static function sanitize(string $value, int $limit): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT', $value) ?: $value;
        $ascii = preg_replace('/[^A-Za-z0-9 ]/', '', $ascii) ?? '';

        return mb_strtoupper(mb_substr(trim($ascii), 0, $limit));
    }

    private static function sanitizeTxid(string $txid): string
    {
        $clean = preg_replace('/[^A-Za-z0-9]/', '', $txid) ?? '';

        return $clean === '' ? '***' : mb_substr($clean, 0, 25);
    }

    /**
     * CRC16-CCITT-FALSE: polinomio 0x1021, valor inicial 0xFFFF.
     */
    private static function crc16(string $payload): string
    {
        $crc = 0xFFFF;

        for ($i = 0; $i < strlen($payload); $i++) {
            $crc ^= ord($payload[$i]) << 8;

            for ($bit = 0; $bit < 8; $bit++) {
                $crc = ($crc & 0x8000)
                    ? (($crc << 1) ^ 0x1021) & 0xFFFF
                    : ($crc << 1) & 0xFFFF;
            }
        }

        return strtoupper(str_pad(dechex($crc), 4, '0', STR_PAD_LEFT));
    }
}
