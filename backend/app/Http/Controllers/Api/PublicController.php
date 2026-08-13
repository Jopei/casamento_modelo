<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GiftResource;
use App\Http\Resources\PhotoResource;
use App\Http\Resources\ScheduleItemResource;
use App\Http\Resources\StoryItemResource;
use App\Http\Resources\WeddingSettingResource;
use App\Models\Gift;
use App\Models\Photo;
use App\Models\ScheduleItem;
use App\Models\StoryItem;
use App\Models\WeddingSetting;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function settings()
    {
        return new WeddingSettingResource(WeddingSetting::current());
    }

    public function story()
    {
        return StoryItemResource::collection(
            StoryItem::orderBy('order')->get()
        );
    }

    public function schedule()
    {
        return ScheduleItemResource::collection(
            ScheduleItem::orderBy('order')->get()
        );
    }

    public function gallery(Request $request)
    {
        return PhotoResource::collection(
            Photo::with('comments.guest')->orderBy('order')->get()
        );
    }

    public function gifts()
    {
        return GiftResource::collection(
            Gift::withCount('reservations')
                // Presentes de valor livre ficam no fim da lista.
                ->orderBy('is_free_amount')
                ->orderBy('name')
                ->get()
        );
    }
}
