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

class ComisionesPorVendedorExport implements FromCollection, WithHeadings, WithStyles, WithEvents
{
    protected int $vendedorId;
    protected string $startDate;
    protected string $endDate;
    protected string $sellerCode;
    protected string $sellerName;

    public function __construct($vendedorId, $startDate, $endDate)
    {
        $this->vendedorId = (int) $vendedorId;
        $this->startDate  = $startDate;
        $this->endDate    = $endDate;

        $seller = Seller::select('seller_code', 'name')->find($this->vendedorId);
        $this->sellerCode = $seller->seller_code ?? 'VND';
        $this->sellerName = $seller->name ?? 'Vendedor';
    }

    public function collection()
    {
        $sales = Sale::with(['client', 'payments.paymentDetails'])
            ->where('seller_id', $this->vendedorId)
            ->where('status', 'despachada')
            ->whereBetween('date_dispatch', [$this->startDate, $this->endDate])
            ->get();

        $rows = collect();

        foreach ($sales as $sale) {
            $totalFactura = 0;
            $totalComisionFactura = 0;
            $isFirstRow = true;

            // 🔹 juntamos todos los abonos de los pagos y ordenamos por fecha
            $abonos = $sale->payments->flatMap->paymentDetails
                ->filter(function ($abono) {
                    // 🔹 excluir los abonos que tengan discount = true o = 1
                    return empty($abono->discount) || $abono->discount == 0;
                })
                ->sortBy(function ($abono) {
                    return $abono->date ? Carbon::parse($abono->date) : now();
                });

            foreach ($abonos as $abono) {
                $valor    = (float) $abono->amount;
                $comision = $valor * 0.05;

                $rows->push([
                    'Factura'      => $isFirstRow ? (string) $sale->invoice_number : '',
                    'Cliente'      => $isFirstRow ? (string) $sale->client->name : '',
                    'Fecha Pago'   => $abono->date ? Carbon::parse($abono->date)->format('d/m/Y') : '',
                    'Valor Pagado' => $valor,
                    'Comisión'     => $comision,
                ]);

                $totalFactura        += $valor;
                $totalComisionFactura += $comision;
                $isFirstRow = false;
            }

            // fila de totales por factura
            if ($totalFactura > 0) {
                $rows->push([
                    'Factura'      => 'TOTAL FACTURA ' . $sale->invoice_number,
                    'Cliente'      => '',
                    'Fecha Pago'   => '',
                    'Valor Pagado' => $totalFactura,
                    'Comisión'     => $totalComisionFactura,
                ]);
            }
        }

        return $rows;
    }



    public function headings(): array
    {
        return ['Factura', 'Cliente', 'Fecha Pago', 'Valor Pagado', 'Comisión'];
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
                $sheet      = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();

                // ===== TÍTULO =====
                $sheet->insertNewRowBefore(1, 1);
                $sheet->mergeCells('A1:E1');
                $sheet->setCellValue(
                    'A1',
                    "REPORTE DE COMISIONES - {$this->sellerName} ({$this->sellerCode}) - Periodo: {$this->startDate} al {$this->endDate}"
                );
                $sheet->getStyle('A1')->applyFromArray([
                    'font'      => ['bold' => true, 'size' => 14, 'color' => ['rgb' => '1F4E78']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                ]);

                // ===== ENCABEZADOS =====
                $sheet->getStyle("A2:E2")->applyFromArray([
                    'font'      => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill'      => ['fillType' => 'solid', 'color' => ['rgb' => '4F81BD']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                ]);

                // ===== BORDES =====
                $sheet->getStyle("A2:E{$highestRow}")
                    ->getBorders()->getAllBorders()
                    ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);


                // ===== FORMATO FILAS DE TOTALES POR FACTURA =====
                for ($row = 3; $row <= $highestRow; $row++) {
                    $facturaCell = trim((string) $sheet->getCell("A{$row}")->getValue());

                    if ($facturaCell !== null && stripos($facturaCell, 'TOTAL FACTURA') === 0) {
                        $sheet->getStyle("A{$row}:E{$row}")->applyFromArray([
                            'font'      => ['bold' => true],
                            'fill'      => ['fillType' => 'solid', 'color' => ['rgb' => 'D9D9D9']], // gris claro
                            'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                        ]);
                        $sheet->getStyle("D{$row}:E{$row}")->applyFromArray([
                            'alignment' => ['horizontal' => 'right'],
                        ]);
                    }
                }


                // ===== TOTALES GENERALES =====
                $totalRow = $highestRow + 2;
                $sheet->setCellValue("C{$totalRow}", "TOTAL GENERAL");
                $sheet->setCellValue("D{$totalRow}", "=SUM(D3:D{$highestRow})");
                $sheet->setCellValue("E{$totalRow}", "=SUM(E3:E{$highestRow})");

                $sheet->getStyle("C{$totalRow}:E{$totalRow}")->applyFromArray([
                    'font'      => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill'      => ['fillType' => 'solid', 'color' => ['rgb' => '228B22']], // verde
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                ]);

                $sheet->getStyle("D{$totalRow}:E{$totalRow}")->applyFromArray([
                    'alignment' => ['horizontal' => 'right'],
                ]);

                // ===== FORMATOS NÚMEROS =====
                $sheet->getStyle("D3:E{$totalRow}")
                    ->getNumberFormat()->setFormatCode('#,##0');

                // ===== AJUSTAR COLUMNAS =====
                foreach (range('A', 'E') as $col) {
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
