<?php

namespace App\Exports;

use App\Models\Sale;
use App\Models\Seller;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Events\AfterSheet;

class CarteraPorVendedorExport implements FromCollection, WithHeadings, WithStyles, WithEvents
{
    protected int $vendedorId;
    protected string $sellerCode;
    protected string $sellerName;

    public function __construct($vendedorId)
    {
        $this->vendedorId = (int) $vendedorId;

        $seller = Seller::select('seller_code', 'name')->find($this->vendedorId);
        $this->sellerCode = $seller->seller_code ?? 'VND';
        $this->sellerName = $seller->name ?? 'Vendedor';
    }

    public function collection()
    {
        $sales = Sale::with(['client', 'payments'])
            ->where('seller_id', $this->vendedorId)
            ->where('status', 'despachada')
            ->get()
            ->filter(function ($sale) {
                // Sumar solo abonos pendientes
                $abonosPend = $sale->payments
                    ->where('status', 'pendiente')
                    ->sum('total_payment');

                // Filtrar: que existan abonos pendientes y que no cubran el total
                return $abonosPend > 0 && $abonosPend < $sale->total;
            })
            ->sortBy(fn($sale) => $sale->client->name)
            ->map(function ($sale) {
                $abonosPend = $sale->payments
                    ->where('status', 'pendiente')
                    ->sum('total_payment');

                $fechaDespacho = $sale->date_dispatch
                    ? Carbon::parse($sale->date_dispatch)->format('d/m/Y')
                    : '';

                $restante = $sale->total - $abonosPend;

                return [
                    'Factura'        => (string) $sale->invoice_number,
                    'Cliente'        => (string) $sale->client->name,
                    'Fecha Despacho' => $fechaDespacho,
                    'Valor Total'    => (float) $sale->total,
                    'Abonos'         => (float) $abonosPend,
                    'Restante'       => (float) $restante,
                ];
            })
            ->values();

        return $sales;
    }


    public function headings(): array
    {
        return ['Factura', 'Cliente', 'Fecha Despacho', 'Valor Total', 'Abonos', 'Restante'];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet        = $event->sheet->getDelegate();
                $highestRow   = $sheet->getHighestRow();
                $highestCol   = $sheet->getHighestColumn();

                // ===== TÍTULO =====
                $sheet->insertNewRowBefore(1, 1);
                $sheet->mergeCells('A1:F1');

                $now = Carbon::now(config('app.timezone'))->format('d/m/Y');
                $sheet->setCellValue('A1', "CARTERA POR VENDEDOR - {$this->sellerName} ({$this->sellerCode}) - Fecha: {$now}");

                $sheet->getStyle('A1')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 12],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                ]);

                // ===== ENCABEZADOS =====
                $sheet->getStyle("A2:F2")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => 'solid', 'color' => ['rgb' => '4F81BD']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                ]);

                // ===== BORDES =====
                $highestRow = $sheet->getHighestRow();
                $sheet->getStyle("A2:F{$highestRow}")
                    ->getBorders()->getAllBorders()
                    ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // ===== TOTALES =====
                $totalRow = $highestRow + 1;
                $sheet->setCellValue("C{$totalRow}", "TOTAL");
                $sheet->setCellValue("D{$totalRow}", "=SUM(D3:D{$highestRow})");
                $sheet->setCellValue("E{$totalRow}", "=SUM(E3:E{$highestRow})");
                $sheet->setCellValue("F{$totalRow}", "=SUM(F3:F{$highestRow})");

                $sheet->getStyle("C{$totalRow}:F{$totalRow}")->applyFromArray([
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                ]);

                // ===== FORMATOS =====
                // miles con puntos (según configuración regional)
                $sheet->getStyle("D3:F{$totalRow}")
                    ->getNumberFormat()->setFormatCode('#,##0');

                // alto de filas y ancho de columnas automáticos
                for ($row = 1; $row <= $totalRow; $row++) {
                    $sheet->getRowDimension($row)->setRowHeight(-1);
                }
                foreach (range('A', 'F') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
                 // ===== CONFIGURACIÓN DE IMPRESIÓN PARA EVITAR QUE SE CORTE =====
                $sheet->getPageSetup()
                    ->setFitToPage(true)
                    ->setFitToWidth(1)
                    ->setFitToHeight(0); // Esto hace que el ancho se ajuste a una página, pero la altura puede ocupar varias.
            },
        ];
    }
}
