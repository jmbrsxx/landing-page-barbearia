import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { appointmentsService } from "@/services/appointmentsService";

const EMPTY_RESERVED_SLOTS: string[] = [];

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  barberId?: string; // Novo: ID do barbeiro para slots específicos
  reservedSlots?: string[]; // Mantido para compatibilidade
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
const getLocalDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isPastTime = (date: string, time: string): boolean => {
  const today = new Date();
  const todayString = getLocalDateString();
  
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

const TimeSlotSelector = ({ selectedDate, selectedTime, onTimeSelect, barberId, reservedSlots }: TimeSlotSelectorProps) => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [internalReservedSlots, setInternalReservedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [availabilityReason, setAvailabilityReason] = useState<string | null>(null);
  const effectiveReservedSlots = reservedSlots ?? EMPTY_RESERVED_SLOTS;

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);

  // Carregar slots disponíveis baseado no barbeiro
  useEffect(() => {
    if (selectedDate) {
      if (barberId) {
        // Novo sistema: slots específicos do barbeiro
        loadAvailableSlotsForBarber();
      } else if (effectiveReservedSlots.length > 0) {
        // Compatibilidade: usar prop reservedSlots
        setInternalReservedSlots(effectiveReservedSlots);
        setAvailabilityReason(null);
      } else {
        // Fallback: carregar slots gerais (compatibilidade com código antigo)
        loadReservedSlots();
      }
    } else {
      setAvailabilityReason(null);
    }
  }, [selectedDate, barberId, effectiveReservedSlots]);

  const loadAvailableSlotsForBarber = async () => {
    if (!barberId || !selectedDate) {
      setLoading(false);
      setAvailabilityReason('error');
      setTimeSlots([]);
      return;
    }

    setLoading(true);
    setAvailabilityReason(null);

    try {
      // Timeout para evitar loading permanente
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 8000);
      });

      const resultPromise = appointmentsService.getAvailableSlots(barberId, selectedDate);
      const result = await Promise.race([resultPromise, timeoutPromise]) as { slots: string[], reason?: string };

      setTimeSlots(result.slots);
      setAvailabilityReason(result.reason || null);
      setInternalReservedSlots([]);
    } catch (error: any) {
      console.error("Erro ao carregar slots disponíveis do barbeiro:", error);
      setTimeSlots([]);
      setAvailabilityReason(error.message === 'timeout' ? 'timeout' : 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadReservedSlots = async () => {
    try {
      const reserved = await appointmentsService.getReservedSlots(selectedDate);
      setInternalReservedSlots(reserved);
    } catch (error) {
      console.error("Erro ao carregar horários reservados:", error);
      setInternalReservedSlots([]);
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
  const availableCount = barberId ? timeSlots.length : timeSlots.length - internalReservedSlots.length - pastSlots.length;

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" />
          Horários Disponíveis
        </Label>
        
        {loading ? (
          <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">Carregando horários...</p>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900">
              {availabilityReason === 'day_off' 
                ? 'O barbeiro está indisponível neste dia (dia de folga)'
                : availabilityReason === 'all_booked'
                ? 'Todos os horários estão ocupados para esta data'
                : availabilityReason === 'timeout'
                ? 'Timeout ao carregar horários. Tente novamente.'
                : availabilityReason === 'error'
                ? 'Erro ao carregar horários. Tente novamente.'
                : 'Nenhum horário disponível para esta data'
              }
            </p>
          </div>
        ) : (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{availableCount}</span> horários disponíveis em <span className="font-semibold">{new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}</span>
              {barberId && <span className="block text-xs mt-1">Horários específicos do barbeiro selecionado</span>}
            </p>
          </div>
        )}

        {timeSlots.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((slot) => {
              const isReserved = barberId ? false : internalReservedSlots.includes(slot); // No novo sistema, slots já são filtrados
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
                      ? "bg-primary text-primary-foreground border-primary shadow-lg"
                      : "bg-white border-primary/20 text-primary hover:border-primary hover:bg-primary/10 cursor-pointer"
                  )}
                >
                  {slot}
                  {isReserved && <div className="text-xs mt-1">Ocupado</div>}
                  {isPast && !isReserved && <div className="text-xs mt-1">Passado</div>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {(internalReservedSlots.length > 0 || pastSlots.length > 0) && (
        <div className="text-xs text-gray-500 text-center">
          {effectiveReservedSlots.length > 0 && <div>{effectiveReservedSlots.length} horário(s) já reservado(s)</div>}
          {pastSlots.length > 0 && <div>{pastSlots.length} horário(s) já passado(s)</div>}
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
