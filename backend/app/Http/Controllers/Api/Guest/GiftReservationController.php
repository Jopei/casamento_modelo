<?php

namespace App\Http\Controllers\Api\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\StoreGiftReservationRequest;
use App\Http\Resources\GiftResource;
use App\Models\Gift;
use App\Models\GiftReservation;
use App\Models\WeddingSetting;
use App\Support\PixPayload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class GiftReservationController extends Controller
{
    public function store(StoreGiftReservationRequest $request, Gift $gift)
    {
        $giverName = trim((string) $request->validated('giver_name'));
        $giverName = $giverName === '' ? null : $giverName;
        // Sem nome nao ha o que exibir: show_name e coagido para false.
        $showName = $giverName !== null && $request->boolean('show_name');
        $cancelToken = Str::random(40);

        $reservation = DB::transaction(function () use ($request, $gift, $giverName, $showName, $cancelToken) {
            $locked = Gift::whereKey($gift->id)->lockForUpdate()->firstOrFail();

            if (! $locked->is_free_amount
                && $locked->reservations()->count() >= $locked->quantity) {
                abort(Response::HTTP_CONFLICT, 'Este presente ja foi reservado.');
            }

            $amount = $locked->is_free_amount
                ? (float) $request->validated('amount')
                : (float) $locked->price;

            return GiftReservation::create([
                'gift_id' => $locked->id,
                'guest_id' => null,
                'giver_name' => $giverName,
                'cancel_token_hash' => hash('sha256', $cancelToken),
                'amount' => $amount,
                'status' => $locked->is_free_amount
                    ? GiftReservation::STATUS_PENDING
                    : GiftReservation::STATUS_RESERVED,
                'reserved_at' => now(),
                'show_name' => $showName,
            ]);
        });

        return response()->json([
            'gift' => new GiftResource(
                Gift::withCount('reservations')
                    ->with(Gift::givenByRelation())
                    ->findOrFail($gift->id)
            ),
            'reservation' => $this->reservationPayload($reservation->fresh(), $gift->is_free_amount, $cancelToken),
        ]);
    }

    public function cancel(Request $request, GiftReservation $giftReservation)
    {
        $token = $request->input('cancel_token');
        $hash = $giftReservation->cancel_token_hash;

        if (! is_string($token) || $token === '' || ! $hash
            || ! hash_equals($hash, hash('sha256', $token))) {
            abort(Response::HTTP_FORBIDDEN, 'Voce nao pode liberar este presente.');
        }

        if ($giftReservation->isPaid()) {
            abort(Response::HTTP_CONFLICT, 'Este presente ja foi confirmado pelos noivos.');
        }

        $giftReservation->delete();

        return response()->noContent();
    }

    private function reservationPayload(GiftReservation $reservation, bool $isFreeAmount, string $cancelToken): array
    {
        return [
            'id' => $reservation->id,
            'amount' => $reservation->amount,
            'status' => $reservation->status,
            'show_name' => (bool) $reservation->show_name,
            'giver_name' => $reservation->giver_name,
            'pix_payload' => $isFreeAmount
                ? PixPayload::forSettings(
                    WeddingSetting::current(),
                    (float) $reservation->amount,
                    'PRES'.str_pad((string) $reservation->id, 6, '0', STR_PAD_LEFT),
                )
                : null,
            'cancel_token' => $cancelToken,
        ];
    }
}
