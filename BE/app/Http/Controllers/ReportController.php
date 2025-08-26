<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CarteraGeneralExport;
use App\Exports\CarteraPorVendedorExport;
use App\Exports\ComisionesPorVendedorExport;
use App\Models\Seller;
use Carbon\Carbon;

class ReportController extends Controller
{

    public function exportCarteraGeneral()
    {
        $filename = 'cartera_general_' . now()->format('Ymd_His') . '.xlsx';

        return Excel::download(new CarteraGeneralExport(), $filename);
    }

    public function exportCarteraPorVendedor($id)
    {
        $seller = Seller::select('id', 'seller_code', 'name')->findOrFail($id);

        $export = new CarteraPorVendedorExport($seller->id);

        $code     = $seller->seller_code ?: ('VEND_' . $seller->id);
        $filename = "carteraVendedor{$code}-" . now()->format('Ymd_His') . '.xlsx';

        return Excel::download($export, $filename);
    }

    public function exportComisionesPorVendedor(Request $request, $id)
    {
        // Validamos las fechas que vienen en la request
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->input('start_date'))->format('Y-m-d');
        $endDate   = Carbon::parse($request->input('end_date'))->format('Y-m-d');

        // Instanciamos el export con vendedor y fechas
        $export = new ComisionesPorVendedorExport($id, $startDate, $endDate);

        // Generamos nombre de archivo dinámico
        $filename = "comisionesVendedor_{$id}_{$startDate}_{$endDate}_" . now()->format('Ymd_His') . ".xlsx";

        return Excel::download($export, $filename);
    }
}
