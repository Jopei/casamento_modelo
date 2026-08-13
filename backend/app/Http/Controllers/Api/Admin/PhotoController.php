<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePhotoRequest;
use App\Http\Requests\Admin\UpdatePhotoRequest;
use App\Http\Resources\PhotoAdminResource;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function index()
    {
        return PhotoAdminResource::collection(
            Photo::orderBy('order')->paginate(20)
        );
    }

    public function store(StorePhotoRequest $request)
    {
        $path = $request->file('image')->store('photos', 'public');

        $photo = Photo::create([
            'path' => $path,
            'caption' => $request->validated('caption'),
            'order' => $request->validated('order') ?? 0,
            'uploaded_by_admin_id' => $request->user('admin')->id,
        ]);

        return new PhotoAdminResource($photo);
    }

    public function update(UpdatePhotoRequest $request, Photo $photo)
    {
        $data = $request->safe()->only(['caption', 'order']);

        if ($request->hasFile('image')) {
            $data['path'] = $request->file('image')->store('photos', 'public');
        }

        $photo->update($data);

        return new PhotoAdminResource($photo);
    }

    public function destroy(Photo $photo)
    {
        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return response()->noContent();
    }
}
