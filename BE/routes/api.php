<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\DB;
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

    Route::get('/roles', function () {
        $data = DB::table("roles")->get();
        return response()->json($data, 200);
    });

    Route::resource('users', UserController::class);

    Route::get('/clients/check-document', [ClientController::class, 'checkDocument']);
    
    Route::get('/labels', [ClientController::class, 'getLabels']);
    Route::put('/labels/{id}', [ClientController::class, 'updateLabel']);
    Route::resource('clients', ClientController::class);

    Route::resource('products', ProductController::class);

    Route::get('/sellers/check-document', [SellerController::class, 'checkDocument']);
    Route::get('/sellers/check-code', [SellerController::class, 'checkCode']);
    Route::resource('sellers', SellerController::class);

    Route::patch('/sales/dispatch/{id}', [SaleController::class, 'dispatchSale']);
    Route::resource('sales', SaleController::class);

    Route::resource('payments', PaymentController::class);

    Route::resource('returns', ReturnController::class);

    Route::get('/reports/cartera-general', [ReportController::class, 'exportCarteraGeneral']);
    Route::get('/reports/cartera-por-vendedor/{id}', [ReportController::class, 'exportCarteraPorVendedor']);
    Route::get('/reports/commissions/{id}', [ReportController::class, 'exportComisionesPorVendedor']);
    
});
