"use client"

import { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CashFlowData {
    period: string;
    week?: string;
    month?: number;
    year: number;
    startDate: string;
    endDate: string;
    totalEntradas: number;
    totalSaidas: number;
    saldoPeriodo: number;
    saldoAcumulado: number;
    sales: Array<{
        id: number;
        sale_date: string;
        total_amount: number;
        items: Array<{
            product_name: string;
            quantity: number;
            unit_price: number;
        }>;
        payment_type: string;
    }>;
}

interface Props {
    cashFlow: CashFlowData;
    weekOptions: Record<string, string>;
    monthOptions: Record<number, string>;
}

export default function FluxoCaixa({ cashFlow, weekOptions, monthOptions }: Props) {
    const [period, setPeriod] = useState(cashFlow.period);
    const [selectedWeek, setSelectedWeek] = useState(cashFlow.week || '');
    const [selectedMonth, setSelectedMonth] = useState(cashFlow.month || new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(cashFlow.year);

    const handlePeriodChange = (newPeriod: string) => {
        setPeriod(newPeriod);

        const params: Record<string, string | number> = { period: newPeriod };

        if (newPeriod === 'week') {
            params.week = selectedWeek || Object.keys(weekOptions)[0];
        } else {
            params.month = selectedMonth;
            params.year = selectedYear;
        }

        router.get('/fluxo-de-caixa', params, {
            preserveState: true
        });
    };

    const handleWeekChange = (week: string) => {
        setSelectedWeek(week);
        router.get('/fluxo-de-caixa', {
            period: 'week',
            week: week
        }, {
            preserveState: true
        });
    };

    const handleMonthChange = (month: number) => {
        setSelectedMonth(month);
        router.get('/fluxo-de-caixa', {
            period: 'month',
            month: month,
            year: selectedYear
        }, {
            preserveState: true
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const periodLabel = period === 'week' ? 'Semanal' : 'Mensal'

    return (
        <>
            <Head title="Fluxo de Caixa" />
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <Card className="border-2 shadow-xl w-[500px]">
                    <CardContent className="p-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-2xl font-bold text-green-800">
                                <BarChart3 className="w-7 h-7 text-green-600" />
                                Fluxo de Caixa
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Período</Label>
                                <Select value={period} onValueChange={handlePeriodChange}>
                                    <SelectTrigger className="w-full bg-white border border-black">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="week">Semanal</SelectItem>
                                        <SelectItem value="month">Mensal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Fluxo {periodLabel}</Label>
                                {period === 'week' ? (
                                    <Select value={selectedWeek} onValueChange={handleWeekChange}>
                                        <SelectTrigger className="w-full bg-white border border-black">
                                            <SelectValue placeholder="Selecione uma semana" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(weekOptions).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Select value={selectedMonth.toString()} onValueChange={(value) => handleMonthChange(parseInt(value))}>
                                        <SelectTrigger className="w-full bg-white border border-black">
                                            <SelectValue placeholder="Selecione um mês" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(monthOptions).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span>Entradas</span>
                                <span className="text-green-600 font-semibold">
                                    {formatCurrency(cashFlow.totalEntradas)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saídas</span>
                                <span className="text-red-600 font-semibold">
                                    {formatCurrency(cashFlow.totalSaidas)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saldo {periodLabel}</span>
                                <span className="font-semibold">
                                    {formatCurrency(cashFlow.saldoPeriodo)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saldo Acumulado</span>
                                <span className="font-semibold">
                                    {formatCurrency(cashFlow.saldoAcumulado)}
                                </span>
                            </div>
                        </div>

                        {cashFlow.sales.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-base font-semibold text-green-800">
                                    Vendas do Período ({cashFlow.sales.length})
                                </Label>
                                <div className="max-h-32 overflow-y-auto space-y-1">
                                    {cashFlow.sales.map((sale) => (
                                        <div
                                            key={sale.id}
                                            className="flex justify-between items-center text-xs border-b py-1"
                                        >
                                            <div>
                                                <div className="font-medium">{sale.sale_date}</div>
                                                <div className="text-gray-600">
                                                    {sale.items.map(item => item.product_name).join(', ')}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-green-600">
                                                    {formatCurrency(sale.total_amount)}
                                                </div>
                                                <div className="text-gray-500 capitalize">
                                                    {sale.payment_type === 'cash' ? 'Dinheiro' : 'PIX'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-xs text-center text-green-500 pt-2 italic">
                            ● Ciclo Aberto
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                type="button"
                                asChild
                                className="bg-gray-100 hover:bg-gray-200 border border-black text-black"
                            >
                                <Link href="/">Voltar</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
