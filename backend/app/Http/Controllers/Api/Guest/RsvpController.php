<?php

namespace App\Http\Controllers\Api\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\StoreRsvpRequest;
use App\Http\Resources\RsvpResource;
use Illuminate\Http\Request;

class RsvpController extends Controller
{
    public function store(StoreRsvpRequest $request)
    {
        $guest = $request->user('guest');

        $rsvp = $guest->rsvp()->updateOrCreate(
            ['guest_id' => $guest->id],
            $request->validated()
        );

        return new RsvpResource($rsvp);
    }
}
