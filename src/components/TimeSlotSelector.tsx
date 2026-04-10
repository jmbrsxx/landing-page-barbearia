import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { appointmentsService } from "@/services/appointmentsService";
import { useAuth } from "@/contexts/AuthContext";

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const BUSINESS_HOURS = {
  start: 8, // 08:00
  end: 18, // 18:00
  interval: 60, // minutos
};

// Gerar lista de horários disponíveis
const generateTimeSlots = () => {
  const slots: string[] = [];
  const { start, end, interval } = BUSINESS_HOURS;

  for (let hour = start; hour < end; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

// Verificar se um horário já passou
const isPastTime = (date: string, time: string): boolean => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  
  // Se for data anterior a hoje, não importa o horário
  if (date < todayString) {
    return true;
  }
  
  // Se for hoje, verificar se o horário já passou
  if (date === todayString) {
    const [hours, minutes] = time.split(":").map(Number);
    const slotTime = new Date(today);
    slotTime.setHours(hours, minutes, 0, 0);
    
    return slotTime <= today;
  }
  
  return false;
};

const TimeSlotSelector = ({ selectedDate, selectedTime, onTimeSelect }: TimeSlotSelectorProps) => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadReservedSlots();
    }
  }, [selectedDate, user]);

  const loadReservedSlots = async () => {
    // Apenas usuários logados podem ver horários reservados (por segurança)
    if (!user) {
      setReservedSlots([]);
      return;
    }

    try {
      const reserved = await appointmentsService.getReservedSlots(selectedDate);
      setReservedSlots(reserved);
    } catch (error) {
      console.error("Erro ao carregar horários reservados:", error);
      setReservedSlots([]);
    }
  };

  if (!selectedDate) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-900">Selecione uma data primeiro</p>
          <p className="text-xs text-amber-700">Escolha uma data acima para ver os horários disponíveis</p>
        </div>
      </div>
    );
  }

  const pastSlots = timeSlots.filter(slot => isPastTime(selectedDate, slot));
  const availableCount = timeSlots.length - reservedSlots.length - pastSlots.length;

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" />
          Horários Disponíveis
        </Label>
        
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{availableCount}</span> horários disponíveis em <span className="font-semibold">{new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}</span>
            {!user && <span className="block text-xs mt-1">💡 Reserve seu horário - verificaremos disponibilidade no momento do agendamento</span>}
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((slot) => {
            const isReserved = reservedSlots.includes(slot);
            const isPast = isPastTime(selectedDate, slot);
            const isDisabled = isReserved || isPast;
            const isSelected = selectedTime === slot;

            return (
              <button
                key={slot}
                type="button"
                onClick={() => !isDisabled && onTimeSelect(slot)}
                disabled={isDisabled}
                className={cn(
                  "p-3 rounded-lg border-2 font-medium text-sm transition-all duration-200",
                  isDisabled
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                    : isSelected
                    ? "bg-green-600 border-green-700 text-white shadow-lg"
                    : "bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50 cursor-pointer"
                )}
              >
                {slot}
                {isReserved && <div className="text-xs mt-1">Ocupado</div>}
                {isPast && !isReserved && <div className="text-xs mt-1">Passado</div>}
              </button>
            );
          })}
        </div>
      </div>

      {(reservedSlots.length > 0 || pastSlots.length > 0) && (
        <div className="text-xs text-gray-500 text-center">
          {reservedSlots.length > 0 && <div>{reservedSlots.length} horário(s) já reservado(s)</div>}
          {pastSlots.length > 0 && <div>{pastSlots.length} horário(s) já passado(s)</div>}
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
