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
use Symfony\Component\HttpFoundation\Response;

class GiftReservationController extends Controller
{
    public function store(StoreGiftReservationRequest $request, Gift $gift)
    {
        $guest = $request->user('guest');

        $reservation = DB::transaction(function () use ($request, $gift, $guest) {
            $locked = Gift::whereKey($gift->id)->lockForUpdate()->firstOrFail();

            $alreadyChosen = $locked->reservations()
                ->where('guest_id', $guest->id)
                ->exists();

            if (! $locked->is_free_amount) {
                if ($alreadyChosen) {
                    abort(Response::HTTP_CONFLICT, 'Voce ja escolheu este presente.');
                }

                if ($locked->reservations()->count() >= $locked->quantity) {
                    abort(Response::HTTP_CONFLICT, 'Este presente ja foi reservado.');
                }
            }

            $amount = $locked->is_free_amount
                ? (float) $request->validated('amount')
                : (float) $locked->price;

            // No presente de valor livre o convidado pode contribuir mais de
            // uma vez, mas o unique (gift_id, guest_id) so permite uma linha,
            // entao a contribuicao anterior e somada.
            if ($locked->is_free_amount && $alreadyChosen) {
                $existing = $locked->reservations()->where('guest_id', $guest->id)->first();
                $existing->update([
                    'amount' => (float) $existing->amount + $amount,
                    'status' => GiftReservation::STATUS_PENDING,
                    'reserved_at' => now(),
                ]);

                return $existing->fresh();
            }

            return GiftReservation::create([
                'gift_id' => $locked->id,
                'guest_id' => $guest->id,
                'amount' => $amount,
                'status' => GiftReservation::STATUS_PENDING,
                'reserved_at' => now(),
            ]);
        });

        return response()->json([
            'gift' => new GiftResource($gift->fresh()->loadCount('reservations')),
            'reservation' => $this->reservationPayload($reservation),
        ]);
    }

    public function destroy(Request $request, Gift $gift)
    {
        $guest = $request->user('guest');

        $reservation = $gift->reservations()->where('guest_id', $guest->id)->first();

        if (! $reservation) {
            abort(Response::HTTP_FORBIDDEN, 'Voce nao pode liberar este presente.');
        }

        if ($reservation->isPaid()) {
            abort(Response::HTTP_CONFLICT, 'Este presente ja foi confirmado pelos noivos.');
        }

        $reservation->delete();

        return response()->noContent();
    }

    private function reservationPayload(GiftReservation $reservation): array
    {
        $amount = (float) $reservation->amount;

        return [
            'id' => $reservation->id,
            'amount' => $reservation->amount,
            'status' => $reservation->status,
            'pix_payload' => PixPayload::forSettings(
                WeddingSetting::current(),
                $amount,
                'PRES'.str_pad((string) $reservation->id, 6, '0', STR_PAD_LEFT),
            ),
        ];
    }
}
