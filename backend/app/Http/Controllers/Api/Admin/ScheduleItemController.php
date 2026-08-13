<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ScheduleItemRequest;
use App\Http\Resources\ScheduleItemResource;
use App\Models\ScheduleItem;

class ScheduleItemController extends Controller
{
    public function index()
    {
        return ScheduleItemResource::collection(
            ScheduleItem::orderBy('order')->get()
        );
    }

    public function store(ScheduleItemRequest $request)
    {
        $item = ScheduleItem::create($request->validated());

        return new ScheduleItemResource($item);
    }

    public function update(ScheduleItemRequest $request, ScheduleItem $scheduleItem)
    {
        $scheduleItem->update($request->validated());

        return new ScheduleItemResource($scheduleItem);
    }

    public function destroy(ScheduleItem $scheduleItem)
    {
        $scheduleItem->delete();

        return response()->noContent();
    }
}
