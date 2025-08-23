<?php

namespace App\Exports;

use App\Models\Sale;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CarteraGeneralExport implements FromCollection, WithEvents
{
    public function collection()
    {
        $sales = Sale::with(['client', 'seller', 'payments'])
            ->where('status', 'despachada')
            ->get()
            ->filter(function ($sale) {
                $abonosPend = $sale->payments
                    ->where('status', 'pendiente')
                    ->sum('total_payment');

                return $abonosPend > 0 && $abonosPend < $sale->total;
            })
            ->groupBy(fn($sale) => $sale->seller->seller_code ?? 'SIN VENDEDOR');

        $rows = collect();

        // Título general
        $rows->push([
            'Factura'        => '',
            'Cliente'        => '',
            'Fecha Despacho' => '',
            'Valor Total'    => '',
            'Abonos'         => '',
            'Restante'       => '',
            'Ciudad'         => '',
        ]);

        foreach ($sales as $sellerCode => $sellerSales) {
            // Título vendedor
            $rows->push([
                'Factura'        => 'VENDEDOR ' . $sellerCode,
                'Cliente'        => '',
                'Fecha Despacho' => '',
                'Valor Total'    => '',
                'Abonos'         => '',
                'Restante'       => '',
                'Ciudad'         => '',
            ]);

            // Encabezados
            $rows->push([
                'Factura'        => 'Factura',
                'Cliente'        => 'Cliente',
                'Fecha Despacho' => 'Fecha Despacho',
                'Valor Total'    => 'Valor Total',
                'Abonos'         => 'Abonos',
                'Restante'       => 'Restante',
                'Ciudad'         => 'Ciudad',
            ]);

            $totalValor    = 0;
            $totalAbonos   = 0;
            $totalRestante = 0;

            foreach ($sellerSales as $sale) {
                $abonosPend = $sale->payments
                    ->where('status', 'pendiente')
                    ->sum('total_payment');

                $fechaDespacho = $sale->date_dispatch
                    ? Carbon::parse($sale->date_dispatch)->format('d/m/Y')
                    : '';

                $restante = $sale->total - $abonosPend;

                $totalValor    += $sale->total;
                $totalAbonos   += $abonosPend;
                $totalRestante += $restante;

                $rows->push([
                    'Factura'        => (string) $sale->invoice_number,
                    'Cliente'        => (string) $sale->client->name,
                    'Fecha Despacho' => $fechaDespacho,
                    'Valor Total'    => (float) $sale->total,
                    'Abonos'         => (float) $abonosPend,
                    'Restante'       => (float) $restante,
                    'Ciudad'         => (string) ($sale->client->city ?? ''),
                ]);
            }

            // Totales
            $rows->push([
                'Factura'        => '',
                'Cliente'        => 'TOTAL',
                'Fecha Despacho' => '',
                'Valor Total'    => (float) $totalValor,
                'Abonos'         => (float) $totalAbonos,
                'Restante'       => (float) $totalRestante,
                'Ciudad'         => '',
            ]);

            // Fin de tabla vendedor
            $rows->push([
                'Factura'        => '----------FIN TABLA----------',
                'Cliente'        => '',
                'Fecha Despacho' => '',
                'Valor Total'    => '',
                'Abonos'         => '',
                'Restante'       => '',
                'Ciudad'         => '',
            ]);
        }


        return $rows;
    }


    // public function headings(): array
    // {
    //     return ['Cod Vendedor', 'Factura', 'Cliente', 'Fecha Despacho', 'Valor Total', 'Abonos', 'Restante', 'Ciudad'];
    // }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Título con fecha correcta
                $sheet->insertNewRowBefore(1, 1);
                $sheet->mergeCells('A1:G1');
                $sheet->setCellValue('A1', 'CARTERA GENERAL GENERADA: ' . Carbon::now(config('app.timezone'))->format('d/m/Y H:i'));

                $sheet->getStyle('A1')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 12],
                    'alignment' => ['horizontal' => 'center'],
                ]);

                $highestRow = $sheet->getHighestRow();

                // Recorremos todas las filas para aplicar estilos dinámicos
                for ($row = 2; $row <= $highestRow; $row++) {
                    $value = $sheet->getCell("A{$row}")->getValue();

                    if (strpos($value, 'VENDEDOR') === 0) {
                        // Fila de título vendedor
                        $sheet->mergeCells("A{$row}:G{$row}");
                        $sheet->getStyle("A{$row}:G{$row}")->applyFromArray([
                            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                            'fill' => ['fillType' => 'solid', 'color' => ['rgb' => '4F81BD']],
                            'alignment' => ['horizontal' => 'left', 'vertical' => 'center'],
                        ]);
                    } elseif ($value === 'Factura') {
                        // Encabezados de tabla
                        $sheet->getStyle("A{$row}:G{$row}")->applyFromArray([
                            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                            'fill' => ['fillType' => 'solid', 'color' => ['rgb' => '4F81BD']],
                            'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                        ]);
                    } elseif (strpos($value, 'FIN TABLA') !== false) {
                        // Escribir el texto en la columna D (o C si prefieres)
                        $sheet->setCellValue("D{$row}", '---FIN TABLA---');

                        // Limpiar el resto de celdas de la fila
                        foreach (['A', 'B', 'C', 'E', 'F', 'G'] as $col) {
                            $sheet->setCellValue("{$col}{$row}", '');
                        }

                        // Estilo solo para columna D
                        $sheet->getStyle("D{$row}")->applyFromArray([
                            'font' => ['italic' => true, 'color' => ['rgb' => '666666']],
                            'alignment' => ['horizontal' => 'center'],
                        ]);
                    } elseif ($sheet->getCell("B{$row}")->getValue() === 'TOTAL') {
                        $sheet->getStyle("A{$row}:G{$row}")->applyFromArray([
                            'font' => ['bold' => true],
                            'fill' => ['fillType' => 'solid', 'color' => ['rgb' => 'D9E1F2']],
                        ]);
                    }
                }

                // Bordes generales para toda la zona de datos
                $sheet->getStyle("A2:G{$highestRow}")
                    ->getBorders()->getAllBorders()
                    ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // Formatos de número (columnas E-G)
                $sheet->getStyle("D3:G{$highestRow}")
                    ->getNumberFormat()->setFormatCode('#,##0');

                // Autosize columnas
                foreach (range('A', 'G') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
            }
        ];
    }
}
