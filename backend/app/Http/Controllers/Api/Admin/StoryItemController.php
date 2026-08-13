<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoryItemRequest;
use App\Http\Resources\StoryItemResource;
use App\Models\StoryItem;
use Illuminate\Support\Facades\Storage;

class StoryItemController extends Controller
{
    public function index()
    {
        return StoryItemResource::collection(
            StoryItem::orderBy('order')->get()
        );
    }

    public function store(StoryItemRequest $request)
    {
        $data = $request->safe()->only(['title', 'description', 'year', 'order']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('story', 'public');
        }

        $item = StoryItem::create($data);

        return new StoryItemResource($item);
    }

    public function update(StoryItemRequest $request, StoryItem $storyItem)
    {
        $data = $request->safe()->only(['title', 'description', 'year', 'order']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('story', 'public');
        }

        $storyItem->update($data);

        return new StoryItemResource($storyItem);
    }

    public function destroy(StoryItem $storyItem)
    {
        if ($storyItem->image_path) {
            Storage::disk('public')->delete($storyItem->image_path);
        }

        $storyItem->delete();

        return response()->noContent();
    }
}
