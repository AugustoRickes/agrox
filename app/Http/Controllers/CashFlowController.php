<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashFlowController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', 'month'); // mes/semana
        $week = $request->get('week');
        $month = $request->get('month');
        $year = $request->get('year', now()->year);

        if ($period === 'week') {
            if ($week) {
                // formato(ano-semana)
                $weekParts = explode('-W', $week);
                $weekYear = $weekParts[0];
                $weekNumber = $weekParts[1];

                $startDate = Carbon::now()->setISODate($weekYear, $weekNumber, 1);
                $endDate = Carbon::now()->setISODate($weekYear, $weekNumber, 7);
            } else {
                $startDate = now()->startOfWeek(Carbon::MONDAY);
                $endDate = now()->endOfWeek(Carbon::SUNDAY);
            }
        } else {
            if ($month) {
                $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
                $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();
            } else {
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
            }
        }

        // busca vendas periodo
        $sales = Sale::with(['saleItems.product', 'payments'])
            ->whereDate('sale_date', '>=', $startDate->format('Y-m-d'))
            ->whereDate('sale_date', '<=', $endDate->format('Y-m-d'))
            ->orderBy('sale_date', 'desc')
            ->get();


        $totalEntradas = $sales->sum('total_amount');
        $totalSaidas = 0;
        $saldoPeriodo = $totalEntradas - $totalSaidas;

        // calcula saldo acumulado ate o final do periodo
        $saldoAcumulado = Sale::where('sale_date', '<=', $endDate)->sum('total_amount');

        $weekOptions = $this->getWeekOptions();
        $monthOptions = $this->getMonthOptions();

        return Inertia::render('Fluxo-de-caixa/Index', [
            'cashFlow' => [
                'period' => $period,
                'week' => $week,
                'month' => $month,
                'year' => $year,
                'startDate' => $startDate->format('Y-m-d'),
                'endDate' => $endDate->format('Y-m-d'),
                'totalEntradas' => $totalEntradas,
                'totalSaidas' => $totalSaidas,
                'saldoPeriodo' => $saldoPeriodo,
                'saldoAcumulado' => $saldoAcumulado,
                'sales' => $sales->map(function ($sale) {
                    return [
                        'id' => $sale->id,
                        'sale_date' => $sale->sale_date->format('d/m/Y H:i'),
                        'total_amount' => $sale->total_amount,
                        'items' => $sale->saleItems->map(function ($item) {
                            return [
                                'product_name' => $item->product->name,
                                'quantity' => $item->quantity,
                                'unit_price' => $item->unit_price,
                            ];
                        }),
                        'payment_type' => $sale->payments->first()->type ?? 'N/A',
                    ];
                })
            ],
            'weekOptions' => $weekOptions,
            'monthOptions' => $monthOptions
        ]);
    }

    private function getWeekOptions()
    {
        $weeks = [];
        $currentYear = now()->year;

        // gera as semanas ano atual
        for ($week = 1; $week <= 52; $week++) {
            $startOfWeek = Carbon::now()->setISODate($currentYear, $week, 1);
            $endOfWeek = Carbon::now()->setISODate($currentYear, $week, 7);

            $weeks[sprintf('%d-W%02d', $currentYear, $week)] = sprintf(
                'Semana %02d (%s a %s)',
                $week,
                $startOfWeek->format('d/m'),
                $endOfWeek->format('d/m')
            );
        }

        return $weeks;
    }

    private function getMonthOptions()
    {
        return [
            1 => 'Janeiro',
            2 => 'Fevereiro',
            3 => 'Março',
            4 => 'Abril',
            5 => 'Maio',
            6 => 'Junho',
            7 => 'Julho',
            8 => 'Agosto',
            9 => 'Setembro',
            10 => 'Outubro',
            11 => 'Novembro',
            12 => 'Dezembro'
        ];
    }
}
