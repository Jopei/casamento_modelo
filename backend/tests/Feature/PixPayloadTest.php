<?php

namespace Tests\Feature;

use App\Support\PixPayload;
use ReflectionMethod;
use Tests\TestCase;

class PixPayloadTest extends TestCase
{
    private function crc(string $value): string
    {
        return (new ReflectionMethod(PixPayload::class, 'crc16'))->invoke(null, $value);
    }

    private function payload(): string
    {
        return PixPayload::build(
            '11999998888',
            'Joaquim e Maria',
            'Sao Paulo',
            25.0,
            'PRES12',
        );
    }

    public function test_it_encodes_each_field_as_id_length_value(): void
    {
        $payload = $this->payload();

        $this->assertStringStartsWith('000201', $payload);
        // 26 carrega o GUI (14 chars) e a chave (11 chars), somando 33.
        $this->assertStringContainsString('26330014BR.GOV.BCB.PIX011111999998888', $payload);
        $this->assertStringContainsString('52040000', $payload);
        $this->assertStringContainsString('5303986', $payload);
        $this->assertStringContainsString('540525.00', $payload);
        $this->assertStringContainsString('5802BR', $payload);
        $this->assertStringContainsString('62100506PRES12', $payload);
    }

    public function test_it_uppercases_and_strips_accents_from_name_and_city(): void
    {
        $payload = PixPayload::build('chave', 'Joaquim & Maria', 'Sao Paulo', 10.0);

        $this->assertStringContainsString('JOAQUIM  MARIA', $payload);
        $this->assertStringContainsString('SAO PAULO', $payload);
    }

    public function test_it_truncates_name_and_city_to_the_brcode_limits(): void
    {
        $payload = PixPayload::build(
            'chave',
            'Um Nome De Recebedor Muito Muito Longo',
            'Uma Cidade Com Nome Enorme',
            10.0,
        );

        $this->assertStringContainsString('5925UM NOME DE RECEBEDOR MUIT', $payload);
        $this->assertStringContainsString('6015UMA CIDADE COM', $payload);
    }

    public function test_crc16_matches_the_ccitt_false_check_value(): void
    {
        // Vetor de teste padrao: CRC-16/CCITT-FALSE de "123456789" e 0x29B1.
        $this->assertSame('29B1', $this->crc('123456789'));
    }

    public function test_the_last_four_digits_are_the_crc_of_everything_before_them(): void
    {
        $payload = $this->payload();

        $body = substr($payload, 0, -4);
        $crc = substr($payload, -4);

        $this->assertSame($this->crc($body), $crc);
        $this->assertStringEndsWith('6304'.$crc, $payload);
    }

    public function test_it_returns_null_when_the_couple_has_no_pix_key(): void
    {
        $settings = new \App\Models\WeddingSetting([
            'groom_name' => 'Joaquim',
            'bride_name' => 'Maria',
        ]);

        $this->assertNull(PixPayload::forSettings($settings, 25.0));
    }

    public function test_it_falls_back_to_the_couple_names_when_no_merchant_name_is_set(): void
    {
        $settings = new \App\Models\WeddingSetting([
            'groom_name' => 'Joaquim',
            'bride_name' => 'Maria',
            'pix_key' => '11999998888',
        ]);

        $payload = PixPayload::forSettings($settings, 25.0);

        $this->assertStringContainsString('JOAQUIM MARIA', $payload);
        $this->assertStringContainsString('BRASIL', $payload);
    }
}
