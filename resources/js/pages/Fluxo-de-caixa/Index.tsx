"use client"

import { useState } from "react"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function FluxoMensal() {
    const [date, setDate] = useState(new Date())

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
            <Card className="border-2 shadow-xl w-[400px]">
                <CardContent className="p-10 space-y-20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-2xl font-bold text-green-800">
                            <BarChart3 className="w-7 h-7 text-green-600" />
                            Fluxo de Caixa
                        </div>
                    </div>


                    <div>
                        <Label>Fluxo Mensal</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal bg-white border border-black text-black"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                    </div>


                    <div className=" space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span>Entradas</span>
                            <span className="text-green-600 font-semibold">R$ 600,00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saídas</span>
                            <span className="text-red-600 font-semibold">R$ 150,00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saldo Mensal</span>
                            <span className="font-semibold">R$ 300,00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saldo Acumulado</span>
                            <span className="font-semibold">R$ 400,00</span>
                        </div>
                    </div>



                    <div className="text-xs text-center text-green-500 pt-2 italic">
                        ● Ciclo Fechado
                    </div>
                    <div className="flex justify-center pt-4">
                        <Button
                            type="button"
                            asChild
                            className="bg-gray-100 hover:bg-gray-200 border border-black text-black">
                            <Link href="/">Voltar</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
