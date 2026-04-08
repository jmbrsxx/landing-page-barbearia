import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2, Calendar, Clock, User, Phone, Loader } from "lucide-react";
import { appointmentsService } from "@/services/appointmentsService";

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  services: string[];
  notes: string;
  status: string;
  createdAt: any;
}

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, selectedDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsService.getAllConfirmedAppointments();
      setAppointments(data as Appointment[]);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar agendamentos");
      console.error("Erro ao carregar agendamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;
    
    if (selectedDate) {
      filtered = appointments.filter(apt => apt.date === selectedDate);
    }

    // Ordenar por data e hora
    filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    setFilteredAppointments(filtered);
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      return;
    }

    try {
      await appointmentsService.updateAppointmentStatus(id, "cancelled");
      await loadAppointments();
    } catch (err: any) {
      alert("Erro ao cancelar agendamento: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 animate-spin text-gray-600" />
        <p className="ml-2 text-gray-600">Carregando agendamentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-900">Erro ao carregar agendamentos</p>
          <p className="text-sm text-red-700">{error}</p>
          <Button onClick={loadAppointments} variant="outline" className="mt-2 text-sm" size="sm">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-blue-900">Total de Agendamentos</p>
          <p className="text-sm text-blue-700">{appointments.length} consultas confirmadas</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Filtrar por Data:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-2 p-2 border rounded-lg w-full md:w-64"
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum agendamento encontrado</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Nome</p>
                      <p className="font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {appointment.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Contato</p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${appointment.phone}`} className="text-blue-600 hover:underline">
                          {appointment.phone}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">{appointment.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Data e Hora</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(appointment.date + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 uppercase mb-2">Serviços</p>
                  <div className="flex flex-wrap gap-2">
                    {appointment.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 uppercase mb-1">Observações</p>
                    <p className="text-sm text-gray-700">{appointment.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <Badge variant="outline" className="bg-green-50">
                    {appointment.status === "confirmed" ? "Confirmado" : "Cancelado"}
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAppointment(appointment.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
