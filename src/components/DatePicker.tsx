import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange(formattedDate);
      setOpen(false);
    }
  };

  const displayDate = value
    ? format(new Date(value + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })
    : placeholder;

  // Validação de data mínima
  const currentDate = value ? new Date(value + "T00:00:00") : undefined;
  const minDateObj = minDate ? new Date(minDate + "T00:00:00") : undefined;
  const disabledDays = minDateObj ? { before: minDateObj } : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-background hover:bg-primary/10 border-primary/70 text-primary",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {displayDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border border-border bg-background shadow-lg" align="start">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleDateSelect}
          disabled={disabledDays}
          defaultMonth={currentDate}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
