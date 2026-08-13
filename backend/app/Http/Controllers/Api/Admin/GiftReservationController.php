<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GiftReservationResource;
use App\Models\GiftReservation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GiftReservationController extends Controller
{
    public function index()
    {
        return GiftReservationResource::collection(
            GiftReservation::with(['gift', 'guest'])->latest()->get()
        );
    }

    public function update(Request $request, GiftReservation $giftReservation)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([GiftReservation::STATUS_PENDING, GiftReservation::STATUS_PAID])],
        ]);

        $paid = $validated['status'] === GiftReservation::STATUS_PAID;

        $giftReservation->update([
            'status' => $validated['status'],
            'paid_at' => $paid ? now() : null,
        ]);

        return new GiftReservationResource($giftReservation->fresh()->load(['gift', 'guest']));
    }

    /**
     * Libera a unidade de volta para a lista publica.
     */
    public function destroy(GiftReservation $giftReservation)
    {
        $giftReservation->delete();

        return response()->noContent();
    }
}
