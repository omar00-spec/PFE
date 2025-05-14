<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\{
    CategoryController,
    CoachController,
    PlayerController,
    ScheduleController,
    RegistrationController,
    MediaController,
    NewsController,
    MatchController,
    ContactController,
    UserController
};

// Exemple de route de test
Route::get('/ping', function () {
    return response()->json(['message' => 'API OK']);
});

// Routes API RESTful pour chaque ressource
Route::apiResource('categories', CategoryController::class);
Route::apiResource('coaches', CoachController::class);
Route::apiResource('players', PlayerController::class);
Route::apiResource('schedules', ScheduleController::class);
Route::apiResource('registrations', RegistrationController::class);
Route::apiResource('media', MediaController::class);
Route::apiResource('news', NewsController::class);
Route::apiResource('matches', MatchController::class);
Route::apiResource('contacts', ContactController::class);





Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin-only', function () {
        return response()->json(['message' => 'Bienvenue Admin !']);
    });
});

Route::post('/create-admin', [UserController::class, 'createAdmin']);

Route::middleware('auth:sanctum')->get('/profile', [UserController::class, 'profile']);





Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes spécifiques pour les actualités et événements
Route::get('/events', [NewsController::class, 'getEvents']);
Route::get('/news-only', [NewsController::class, 'getNews']);

// Routes spécifiques pour les médias
Route::get('/photos', [MediaController::class, 'getPhotos']);
Route::get('/videos', [MediaController::class, 'getVideos']);
Route::get('/media/category/{categoryId}', [MediaController::class, 'getByCategory']);

// Routes pour l'administration des actualités/événements
Route::prefix('admin')->group(function () {
    // Routes admin pour News
    Route::get('/news', [App\Http\Controllers\Admin\NewsController::class, 'index']);
    Route::post('/news', [App\Http\Controllers\Admin\NewsController::class, 'store']);
    Route::get('/news/{id}', [App\Http\Controllers\Admin\NewsController::class, 'show']);
    Route::put('/news/{id}', [App\Http\Controllers\Admin\NewsController::class, 'update']);
    Route::delete('/news/{id}', [App\Http\Controllers\Admin\NewsController::class, 'destroy']);

    // Routes admin pour Media
    Route::get('/media', [App\Http\Controllers\Admin\MediaController::class, 'index']);
    Route::post('/media', [App\Http\Controllers\Admin\MediaController::class, 'store']);
    Route::get('/media/{id}', [App\Http\Controllers\Admin\MediaController::class, 'show']);
    Route::put('/media/{id}', [App\Http\Controllers\Admin\MediaController::class, 'update']);
    Route::delete('/media/{id}', [App\Http\Controllers\Admin\MediaController::class, 'destroy']);
});

// Routes pour les paiements
Route::prefix('payment')->group(function () {
    Route::post('/bank-transfer/create-session', [App\Http\Controllers\PaymentController::class, 'createBankTransferSession']);
    Route::post('/check-status', [App\Http\Controllers\PaymentController::class, 'checkPaymentStatus']);
    Route::post('/webhook', [App\Http\Controllers\PaymentController::class, 'handleWebhook']);
});
