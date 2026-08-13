<?php

use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\GiftController;
use App\Http\Controllers\Api\Admin\GiftReservationController as AdminGiftReservationController;
use App\Http\Controllers\Api\Admin\PhotoController;
use App\Http\Controllers\Api\Admin\RsvpController as AdminRsvpController;
use App\Http\Controllers\Api\Admin\ScheduleItemController;
use App\Http\Controllers\Api\Admin\StoryItemController;
use App\Http\Controllers\Api\Admin\WeddingSettingController;
use App\Http\Controllers\Api\Guest\GiftReservationController as GuestGiftReservationController;
use App\Http\Controllers\Api\Guest\GuestAuthController;
use App\Http\Controllers\Api\Guest\PhotoInteractionController;
use App\Http\Controllers\Api\Guest\RsvpController as GuestRsvpController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/settings', [PublicController::class, 'settings']);
Route::get('/story', [PublicController::class, 'story']);
Route::get('/schedule', [PublicController::class, 'schedule']);
Route::get('/gallery', [PublicController::class, 'gallery']);
Route::get('/gifts', [PublicController::class, 'gifts']);

Route::post('/guest/identify', [GuestAuthController::class, 'identify'])
    ->middleware('throttle:10,1');

Route::post('/admin/login', [AdminAuthController::class, 'login'])
    ->middleware('throttle:10,1');

// Guest (auth:guest)
Route::middleware('auth:guest')->group(function () {
    Route::get('/guest/me', [GuestAuthController::class, 'me']);
    Route::post('/guest/logout', [GuestAuthController::class, 'logout']);

    Route::post('/rsvp', [GuestRsvpController::class, 'store']);

    Route::post('/gifts/{gift}/reserve', [GuestGiftReservationController::class, 'store']);
    Route::delete('/gifts/{gift}/reserve', [GuestGiftReservationController::class, 'destroy']);

    Route::post('/photos/{photo}/like', [PhotoInteractionController::class, 'like']);
    Route::delete('/photos/{photo}/like', [PhotoInteractionController::class, 'unlike']);
    Route::post('/photos/{photo}/comments', [PhotoInteractionController::class, 'storeComment']);
    Route::delete('/photos/{photo}/comments/{comment}', [PhotoInteractionController::class, 'destroyComment']);
    Route::get('/photos/{photo}/download', [PhotoInteractionController::class, 'download']);
});

// Admin (auth:admin)
Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);

    Route::get('/settings', [WeddingSettingController::class, 'show']);
    Route::put('/settings', [WeddingSettingController::class, 'update']);

    Route::apiResource('story-items', StoryItemController::class)->except(['show']);
    Route::apiResource('schedule-items', ScheduleItemController::class)->except(['show']);
    Route::apiResource('photos', PhotoController::class)->except(['show']);
    Route::apiResource('gifts', GiftController::class)->except(['show']);

    Route::get('/rsvps', [AdminRsvpController::class, 'index']);
    Route::get('/gift-reservations', [AdminGiftReservationController::class, 'index']);
    Route::patch('/gift-reservations/{giftReservation}', [AdminGiftReservationController::class, 'update']);
    Route::delete('/gift-reservations/{giftReservation}', [AdminGiftReservationController::class, 'destroy']);
});
