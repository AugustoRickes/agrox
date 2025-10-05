"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, BarChart3, Edit2, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function FluxoMensal() {
    const [date, setDate] = useState(new Date())
    const [cicloAberto, setCicloAberto] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho */}
            <header className="bg-white shadow-sm p-4">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <ArrowLeft className="w-6 h-6 text-green-700 cursor-pointer hover:text-green-500 transition-colors duration-200" />
                    <div className="flex items-center gap-3 text-2xl font-bold text-green-800">
                        <BarChart3 className="w-7 h-7 text-green-600" />
                        Fluxo de Caixa
                    </div>
                    <div className="w-6"></div> {/* Spacer para centralizar */}
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 p-6">
                <div className="max-w-lg mx-auto space-y-6">
                    <div>
                        <Label className="text-lg font-semibold text-gray-700 mb-2 block">Fluxo Mensal</Label>
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal bg-white border border-black text-black h-12 text-lg"
                                    >
                                        <CalendarIcon className="mr-2 h-5 w-5" />
                                        {format(date, "MMMM / yyyy", { locale: ptBR })}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>

                            {cicloAberto && (
                                <Edit2
                                    className="w-5 h-5 text-black-600 cursor-pointer hover:text-black-800"
                                    onClick={() => alert("Abrir edição do ciclo!")}
                                />
                            )}
                        </div>
                    </div>

                    <Card className="border border-green-200 shadow-md">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-6 text-base">
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-700">Entradas</span>
                                    <span className="text-green-600 font-bold text-lg">R$ 600,00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-700">Saídas</span>
                                    <span className="text-red-600 font-bold text-lg">R$ 150,00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-700">Saldo Mensal</span>
                                    <span className="font-bold text-lg">R$ 300,00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-700">Saldo Acumulado</span>
                                    <span className="font-bold text-lg">R$ 400,00</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-sm text-center text-green-500 pt-2 italic">
                        <button
                            onClick={() => setCicloAberto(!cicloAberto)}
                            className="hover:text-green-700 transition-colors"
                        >
                            ● {cicloAberto ? 'Ciclo Aberto' : 'Ciclo Fechado'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
}
