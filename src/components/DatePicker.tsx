import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getMonth, getYear, setMonth, setYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  className?: string;
}

const DatePicker = ({
  value,
  onChange,
  placeholder = "Selecione uma data",
  minDate,
  className,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const currentDate = value ? new Date(value + "T00:00:00") : new Date();
  const [displayDate, setDisplayDate] = useState(currentDate);

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(getYear(displayDate), getMonth(displayDate), day);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    onChange(formattedDate);
    setOpen(false);
  };

  const handleMonthChange = (offset: number) => {
    setDisplayDate(setMonth(displayDate, getMonth(displayDate) + offset));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayDate(setYear(displayDate, parseInt(e.target.value)));
  };

  const handleMonthSelect = (month: number) => {
    setDisplayDate(setMonth(displayDate, month));
  };

  const displayValue = value
    ? format(new Date(value + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })
    : placeholder;

  // Gerar array de dias do mês para exibir
  const monthStart = startOfMonth(displayDate);
  const monthEnd = endOfMonth(displayDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Gerar array de dias vazios antes do primeiro dia do mês
  const startingDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startingDayOfWeek).fill(null);

  // Validação de data mínima
  const minDateObj = minDate ? new Date(minDate + "T00:00:00") : null;
  const isDateDisabled = (day: number) => {
    if (!minDateObj) return false;
    const testDate = new Date(getYear(displayDate), getMonth(displayDate), day);
    return testDate < minDateObj;
  };

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = Array.from({ length: 125 }, (_, i) => new Date().getFullYear() - 124 + i);

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          "bg-gradient-to-r from-[hsl(20,14%,10%)] to-[hsl(20,14%,12%)] hover:from-[hsl(20,14%,12%)] hover:to-[hsl(20,14%,14%)]",
          "border-2 border-[hsl(38,70%,50%)] text-[hsl(38,70%,50%)] hover:text-[hsl(38,80%,55%)]",
          "transition-all duration-300 shadow-lg",
          !value && "text-[hsl(30,10%,55%)]",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-5 w-5" />
        {displayValue}
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 p-6 bg-gradient-to-br from-[hsl(20,14%,8%)] to-[hsl(20,14%,12%)] border-2 border-[hsl(38,70%,50%)] rounded-lg shadow-2xl w-full max-w-md">
          {/* Cabeçalho com Ano e Mês */}
          <div className="space-y-4 mb-6">
            {/* Seletor de Ano */}
            <div>
              <label className="text-xs font-semibold text-[hsl(38,70%,50%)] uppercase block mb-2">Ano</label>
              <select
                value={getYear(displayDate)}
                onChange={handleYearChange}
                className="w-full px-3 py-2 bg-[hsl(20,14%,10%)] border-2 border-[hsl(38,70%,50%)] rounded-lg text-[hsl(38,70%,50%)] font-semibold cursor-pointer hover:bg-[hsl(20,14%,12%)] transition"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-[hsl(20,14%,8%)]">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Seletor de Mês */}
            <div>
              <label className="text-xs font-semibold text-[hsl(38,70%,50%)] uppercase block mb-2">Mês</label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200",
                      getMonth(displayDate) === index
                        ? "bg-[hsl(38,70%,50%)] text-[hsl(20,14%,6%)] shadow-lg"
                        : "bg-[hsl(20,14%,10%)] text-[hsl(38,70%,50%)] hover:bg-[hsl(20,14%,12%)] border border-[hsl(38,70%,50%)]/30"
                    )}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendário */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-center flex-1 font-semibold text-[hsl(38,70%,50%)] text-sm">
                {format(displayDate, "MMMM", { locale: ptBR })} de {getYear(displayDate)}
              </h3>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-xs font-semibold text-[hsl(38,70%,50%)] border-b-2 border-[hsl(38,70%,50%)]/30"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-10" />
              ))}
              {daysInMonth.map((date) => {
                const day = date.getDate();
                const isSelected = value && format(date, "yyyy-MM-dd") === value;
                const isDisabled = isDateDisabled(day);
                const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

                return (
                  <button
                    key={day}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={cn(
                      "h-10 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center",
                      isSelected && "bg-[hsl(38,70%,50%)] text-[hsl(20,14%,6%)] shadow-lg font-bold",
                      !isSelected && !isDisabled && isToday && "border-2 border-[hsl(38,70%,50%)] text-[hsl(38,70%,50%)]",
                      !isSelected && !isDisabled && !isToday && "text-[hsl(40,20%,90%)] hover:bg-[hsl(20,14%,12%)] border border-[hsl(38,70%,50%)]/20",
                      isDisabled && "text-[hsl(30,10%,35%)] opacity-50 cursor-not-allowed"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botão para fechar */}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => setOpen(false)}
              className="flex-1 bg-[hsl(38,70%,50%)] hover:bg-[hsl(38,80%,55%)] text-[hsl(20,14%,6%)] font-semibold transition-all"
            >
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
