<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UsersControllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/profile', fn(Request $request) => $request->user());

    Route::resource('users', UserController::class);

    Route::get('/clients/check-document', [ClientController::class, 'checkDocument']);
    Route::resource('clients', ClientController::class);

    Route::resource('products', ProductController::class);

    Route::get('/sellers/check-document', [SellerController::class, 'checkDocument']);
    Route::get('/sellers/check-code', [SellerController::class, 'checkCode']);
    Route::resource('sellers', SellerController::class);
    
});
