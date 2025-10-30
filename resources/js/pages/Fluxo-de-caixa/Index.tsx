"use client"

import { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BarChart3, ArrowLeft } from "lucide-react"
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
            <div className="min-h-screen bg-gray-50 flex flex-col">
              
                <header className="bg-white shadow-sm p-4">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                        <Link href="/" className="text-green-700 hover:text-green-500 transition-colors duration-200">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center gap-3 text-2xl font-bold text-green-800">
                            <BarChart3 className="w-7 h-7 text-green-600" />
                            Fluxo de Caixa
                        </div>
                        <div className="w-6"></div>
                    </div>
                </header>

               
                <main className="flex-1 p-4">
                    <div className="max-w-lg mx-auto space-y-6">
                        <div className="space-y-6">
                            <div>
                                <Label className="text-3xl font-semibold text-gray-700 mb-2 block">Período</Label>
                                <Select value={period} onValueChange={handlePeriodChange}>
                                    <SelectTrigger className="w-full bg-white border border-black h-17 text-3xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="week" className="text-3xl py-4">Semanal</SelectItem>
                                        <SelectItem value="month" className="text-3xl py-4">Mensal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-3xl font-semibold text-gray-700 mb-2 block">Fluxo {periodLabel}</Label>
                                {period === 'week' ? (
                                    <Select value={selectedWeek} onValueChange={handleWeekChange}>
                                        <SelectTrigger className="w-full bg-white border border-black h-17 text-3xl">
                                            <SelectValue placeholder="Selecione uma semana" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(weekOptions).map(([value, label]) => (
                                                <SelectItem key={value} value={value} className="text-3xl py-4">
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Select value={selectedMonth.toString()} onValueChange={(value) => handleMonthChange(parseInt(value))}>
                                        <SelectTrigger className="w-full bg-white border border-black h-17 text-3xl">
                                            <SelectValue placeholder="Selecione um mês" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(monthOptions).map(([value, label]) => (
                                                <SelectItem key={value} value={value} className="text-3xl py-4">
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        <Card className="border border-green-200 shadow-md">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-5 text-base">
                                    <div className="flex justify-between items-center ">
                                        <span className="font-medium text-[27px] text-gray-700">Entradas</span>
                                        <span className="text-green-600 font-bold text-3xl">
                                            {formatCurrency(cashFlow.totalEntradas)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <span className="font-medium text-[27px] text-gray-700">Saídas</span>
                                        <span className="text-red-600 font-bold text-3xl">
                                            {formatCurrency(cashFlow.totalSaidas)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <span className="font-medium text-[27px] text-gray-700">Saldo {periodLabel}</span>
                                        <span className="font-bold text-3xl">
                                            {formatCurrency(cashFlow.saldoPeriodo)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <span className="font-medium text-[25px] text-gray-700">Saldo Acumulado</span>
                                        <span className="font-bold text-3xl">
                                            {formatCurrency(cashFlow.saldoAcumulado)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {cashFlow.sales.length > 0 && (
                            <Card className="border border-green-200 shadow-md">
                                <CardContent className="p-6 space-y-2">
                                    <Label className="text-3xl font-semibold text-green-800">
                                        Vendas do Período ({cashFlow.sales.length})
                                    </Label>
                                    <div className="max-h-32 overflow-y-auto space-y-3">
                                        {cashFlow.sales.map((sale) => (
                                            <div
                                                key={sale.id}
                                                className="flex justify-between items-center text-3xl border-b py-6"
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
                                </CardContent>
                            </Card>
                        )}

                        <div className="text-xl text-center text-green-500 pt-2 italic">
                            ● Ciclo Aberto
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
