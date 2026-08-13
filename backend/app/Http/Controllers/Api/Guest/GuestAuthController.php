<?php

namespace App\Http\Controllers\Api\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\IdentifyGuestRequest;
use App\Http\Resources\GiftReservationResource;
use App\Http\Resources\GuestResource;
use App\Http\Resources\RsvpResource;
use App\Models\Guest;
use Illuminate\Http\Request;

class GuestAuthController extends Controller
{
    public function identify(IdentifyGuestRequest $request)
    {
        $phone = preg_replace('/\D+/', '', $request->string('phone'));

        $guest = Guest::firstOrCreate(
            ['phone' => $phone],
            ['name' => $request->string('name')]
        );

        if ($guest->wasRecentlyCreated === false && $guest->name !== $request->string('name')->toString()) {
            $guest->update(['name' => $request->string('name')]);
        }

        $token = $guest->createToken('guest', ['guest'])->plainTextToken;

        return response()->json([
            'guest' => new GuestResource($guest),
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        $guest = $request->user('guest');

        return response()->json([
            'guest' => new GuestResource($guest),
            'rsvp' => $guest->rsvp ? new RsvpResource($guest->rsvp) : null,
            'gift_reservation' => $guest->giftReservation
                ? new GiftReservationResource($guest->giftReservation)
                : null,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user('guest')->currentAccessToken()->delete();

        return response()->noContent();
    }
}
