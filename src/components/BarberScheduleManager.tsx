import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appointmentsService, Barber, BarberSchedule } from "@/services/appointmentsService";
import { Clock, RotateCcw, AlertCircle } from "lucide-react";

interface BarberScheduleManagerProps {
  barbers: Barber[];
  onScheduleUpdated?: () => void;
}

const BarberScheduleManager = ({ barbers, onScheduleUpdated }: BarberScheduleManagerProps) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || "");
  const [schedule, setSchedule] = useState<BarberSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUnavailableDate, setNewUnavailableDate] = useState("");
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedTime, setNewBlockedTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dayLabels: { [key: string]: string } = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  // Carregar horários ao mudar o barbeiro selecionado
  useEffect(() => {
    if (selectedBarberId) {
      loadBarberSchedule(selectedBarberId);
    }
  }, [selectedBarberId]);

  const loadBarberSchedule = async (barberId: string) => {
    try {
      setLoading(true);
      setError(null);
      const barberSchedule = await appointmentsService.getBarberSchedule(barberId);
      setSchedule(barberSchedule);
    } catch (err) {
      console.error("Erro ao carregar horários:", err);
      setError("Erro ao carregar horários do barbeiro");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!schedule) return;

    try {
      setSaving(true);
      setError(null);
      await appointmentsService.saveBarberSchedule(schedule);
      setSuccessMessage("Horários salvos com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      if (onScheduleUpdated) {
        onScheduleUpdated();
      }
    } catch (err) {
      console.error("Erro ao salvar horários:", err);
      setError("Erro ao salvar horários. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSchedule = async () => {
    if (!selectedBarberId) return;
    if (!window.confirm("Deseja resetar os horários para o padrão?")) return;

    try {
      setSaving(true);
      setError(null);
      await appointmentsService.resetBarberSchedule(selectedBarberId);
      await loadBarberSchedule(selectedBarberId);
      setSuccessMessage("Horários resetados para o padrão!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Erro ao resetar horários:", err);
      setError("Erro ao resetar horários. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const addUnavailableDate = () => {
    if (!newUnavailableDate || !schedule) return;
    if (schedule.unavailableDates?.includes(newUnavailableDate)) {
      alert("Esta data já está na lista");
      return;
    }

    setSchedule({
      ...schedule,
      unavailableDates: [...(schedule.unavailableDates || []), newUnavailableDate],
    });
    setNewUnavailableDate("");
  };

  const removeUnavailableDate = (date: string) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      unavailableDates: schedule.unavailableDates?.filter(d => d !== date) || [],
    });
  };

  const getBlockedTimeOptions = (date: string) => {
    if (!schedule) return [];
    const selectedDateObj = new Date(`${date}T00:00:00`);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[selectedDateObj.getDay()];
    const daySchedule = schedule.weekSchedule[dayName];

    if (!daySchedule?.isWorking) {
      return [];
    }

    return appointmentsService.generateTimeSlots(daySchedule.startTime, daySchedule.endTime, 30);
  };

  const addBlockedDateTime = () => {
    if (!newBlockedDate || !newBlockedTime || !schedule) return;
    const alreadyBlocked = schedule.unavailableDateTimes?.some((entry) => entry.date === newBlockedDate && entry.time === newBlockedTime);
    if (alreadyBlocked) {
      alert("Este horário já está bloqueado para a data selecionada");
      return;
    }

    setSchedule({
      ...schedule,
      unavailableDateTimes: [...(schedule.unavailableDateTimes || []), { date: newBlockedDate, time: newBlockedTime }],
    });
    setNewBlockedDate("");
    setNewBlockedTime("");
  };

  const removeBlockedDateTime = (entryToRemove: { date: string; time: string }) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      unavailableDateTimes: schedule.unavailableDateTimes?.filter(
        (entry) => entry.date !== entryToRemove.date || entry.time !== entryToRemove.time
      ) || [],
    });
  };

  const updateDayTime = (day: string, field: "startTime" | "endTime", value: string) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      weekSchedule: {
        ...schedule.weekSchedule,
        [day]: {
          ...schedule.weekSchedule[day],
          [field]: value,
        },
      },
    });
  };

  const toggleDayWorking = (day: string) => {
    if (!schedule) return;
    const currentDay = schedule.weekSchedule[day];
    if (!currentDay) return;

    setSchedule({
      ...schedule,
      weekSchedule: {
        ...schedule.weekSchedule,
        [day]: {
          ...currentDay,
          isWorking: !currentDay.isWorking,
        },
      },
    });
  };

  const getSelectedBarberName = () => {
    return barbers.find(b => b.id === selectedBarberId)?.name || "Barbeiro";
  };

  if (barbers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <AlertCircle className="w-5 h-5" />
            <p>Nenhum barbeiro cadastrado. Adicione barbeiros primeiro.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horários de Disponibilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seleção de Barbeiro */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Selecione um Barbeiro</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {barbers.map((barber) => (
              <Button
                key={barber.id}
                variant={selectedBarberId === barber.id ? "default" : "outline"}
                onClick={() => setSelectedBarberId(barber.id)}
                className="h-auto py-2"
              >
                {barber.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✅ {successMessage}
          </div>
        )}

        {/* Conteúdo */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : schedule ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Horários de {getSelectedBarberName()}:</strong>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Configure os dias da semana em que o barbeiro trabalha e seus horários.
              </p>
            </div>

            {/* Grade de Dias */}
            <div className="space-y-3">
              {dayOrder.map((day) => {
                const daySchedule = schedule.weekSchedule[day];
                if (!daySchedule) return null;

                return (
                  <div
                    key={day}
                    className={`p-4 border rounded-lg transition ${
                      daySchedule.isWorking
                        ? "bg-white border-gray-300 hover:border-gray-400"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          id={`work-${day}`}
                          checked={daySchedule.isWorking}
                          onChange={() => toggleDayWorking(day)}
                          className="w-5 h-5 cursor-pointer accent-green-600"
                        />
                        <Label
                          htmlFor={`work-${day}`}
                          className="flex-1 cursor-pointer font-semibold text-gray-900"
                        >
                          {dayLabels[day]}
                        </Label>
                      </div>

                      {daySchedule.isWorking && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Label className="text-xs text-gray-600">De:</Label>
                            <Input
                              type="time"
                              value={daySchedule.startTime}
                              onChange={(e) => updateDayTime(day, "startTime", e.target.value)}
                              className="w-24 h-9"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Label className="text-xs text-gray-600">Até:</Label>
                            <Input
                              type="time"
                              value={daySchedule.endTime}
                              onChange={(e) => updateDayTime(day, "endTime", e.target.value)}
                              className="w-24 h-9"
                            />
                          </div>
                        </div>
                      )}

                      {!daySchedule.isWorking && (
                        <div className="text-gray-500 text-sm font-medium">Dia de folga</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Datas Indisponíveis */}
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-900">Datas Indisponíveis</h4>
              <p className="text-sm text-amber-700">Adicione datas em que o barbeiro não estará disponível para qualquer agendamento.</p>

              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newUnavailableDate}
                  onChange={(e) => setNewUnavailableDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Button onClick={addUnavailableDate} variant="outline" size="sm" disabled={!newUnavailableDate}>
                  Adicionar
                </Button>
              </div>

              {schedule.unavailableDates && schedule.unavailableDates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {schedule.unavailableDates.map((date) => (
                    <div
                      key={date}
                      className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      {new Date(date + "T00:00:00").toLocaleDateString("pt-BR")}
                      <button
                        onClick={() => removeUnavailableDate(date)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-amber-900">Bloquear horário por data</h4>
              <p className="text-sm text-amber-700">Selecione um horário em intervalos de 30 minutos para bloquear em uma data específica.</p>

              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                  <Input
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => {
                      setNewBlockedDate(e.target.value);
                      setNewBlockedTime("");
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Button onClick={addBlockedDateTime} variant="outline" size="sm" disabled={!newBlockedDate || !newBlockedTime}>
                    Bloquear
                  </Button>
                </div>

                {newBlockedDate ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 p-2 bg-white">
                    {getBlockedTimeOptions(newBlockedDate).length > 0 ? (
                      getBlockedTimeOptions(newBlockedDate).map((slot) => {
                        const isAlreadyBlocked = schedule.unavailableDateTimes?.some(
                          (entry) => entry.date === newBlockedDate && entry.time === slot
                        );

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isAlreadyBlocked}
                            onClick={() => setNewBlockedTime(slot)}
                            className={`rounded-lg border px-2 py-2 text-sm text-left transition ${
                              isAlreadyBlocked
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                : newBlockedTime === slot
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-white border-gray-200 text-gray-900 hover:bg-amber-50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full p-3 text-sm text-gray-500">
                        Selecione uma data em que o barbeiro trabalhe para ver os horários de 30 em 30 minutos.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Escolha uma data para selecionar o horário a ser bloqueado.</div>
                )}
              </div>

              {schedule.unavailableDateTimes && schedule.unavailableDateTimes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {schedule.unavailableDateTimes.map((entry) => (
                    <div
                      key={`${entry.date}-${entry.time}`}
                      className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{new Date(entry.date + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                      <span>{entry.time}</span>
                      <button
                        onClick={() => removeBlockedDateTime(entry)}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleSaveSchedule}
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Salvando..." : "Salvar Horários"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResetSchedule}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar para Padrão
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            Carregando horários...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BarberScheduleManager;
