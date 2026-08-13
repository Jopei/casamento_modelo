<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GiftRequest;
use App\Http\Resources\GiftAdminResource;
use App\Models\Gift;
use Illuminate\Support\Facades\Storage;

class GiftController extends Controller
{
    public function index()
    {
        return GiftAdminResource::collection(
            Gift::with('reservations.guest')->withCount('reservations')->orderBy('name')->get()
        );
    }

    public function store(GiftRequest $request)
    {
        $data = $this->payload($request);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('gifts', 'public');
        }

        $gift = Gift::create($data);

        return new GiftAdminResource($gift->fresh()->loadCount('reservations'));
    }

    public function update(GiftRequest $request, Gift $gift)
    {
        $data = $this->payload($request);

        if ($request->hasFile('image')) {
            // Evita deixar orfao o arquivo anterior no storage.
            if ($gift->image_path) {
                Storage::disk('public')->delete($gift->image_path);
            }

            $data['image_path'] = $request->file('image')->store('gifts', 'public');
        }

        $gift->update($data);

        return new GiftAdminResource(
            $gift->fresh()->load('reservations.guest')->loadCount('reservations')
        );
    }

    public function destroy(Gift $gift)
    {
        if ($gift->image_path) {
            Storage::disk('public')->delete($gift->image_path);
        }

        $gift->delete();

        return response()->noContent();
    }

    /**
     * Presente de valor livre nao tem preco nem estoque: quem decide o
     * valor e o convidado, e ele pode ser escolhido quantas vezes quiser.
     */
    private function payload(GiftRequest $request): array
    {
        $data = $request->safe()->only(['name', 'description', 'price', 'quantity', 'is_free_amount']);
        $data['is_free_amount'] = $request->boolean('is_free_amount');
        $data['quantity'] = (int) ($data['quantity'] ?? 1) ?: 1;

        if ($data['is_free_amount']) {
            $data['price'] = null;
            $data['quantity'] = 1;
        }

        return $data;
    }
}
