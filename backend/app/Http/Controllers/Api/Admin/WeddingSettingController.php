<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateWeddingSettingRequest;
use App\Http\Resources\WeddingSettingAdminResource;
use App\Models\WeddingSetting;

class WeddingSettingController extends Controller
{
    public function show()
    {
        return new WeddingSettingAdminResource(WeddingSetting::current());
    }

    public function update(UpdateWeddingSettingRequest $request)
    {
        $setting = WeddingSetting::current();

        $data = $request->safe()->except(['hero_image']);

        if ($request->hasFile('hero_image')) {
            $data['hero_image_path'] = $request->file('hero_image')->store('hero', 'public');
        }

        $setting->update($data);

        return new WeddingSettingAdminResource($setting);
    }
}
