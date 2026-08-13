<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RsvpResource;
use App\Models\Rsvp;

class RsvpController extends Controller
{
    public function index()
    {
        return RsvpResource::collection(
            Rsvp::with('guest')->latest()->paginate(20)
        );
    }
}
