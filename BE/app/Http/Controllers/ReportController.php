<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CarteraGeneralExport;
use App\Exports\CarteraPorVendedorExport;
use App\Models\Seller;

class ReportController extends Controller
{

    public function exportCarteraGeneral()
    {
        $filename = 'cartera_general_' . now()->format('Ymd_His') . '.xlsx';

        return Excel::download(new CarteraGeneralExport(), $filename);
    }

    public function exportCarteraPorVendedor(Request $request)
    {
        $data = $request->validate([
            'vendedor_id' => ['required', 'integer', 'exists:sellers,id'],
        ]);

        $seller = Seller::select('id', 'seller_code', 'name')->findOrFail($data['vendedor_id']);

        $export = new CarteraPorVendedorExport($seller->id);

        $code     = $seller->seller_code ?: ('VEND_' . $seller->id);
        $filename = "cartera_por_vendedor_{$code}_" . now()->format('Ymd_His') . '.xlsx';

        return Excel::download($export, $filename);
    }
}
