import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, TrendingUp, Calendar } from "lucide-react";
import { Service } from "@/services/appointmentsService";

interface DailyStatsProps {
  appointments: any[];
  services: Service[];
}

const DailyStats = ({ appointments, services }: DailyStatsProps) => {
  // Calcular estatísticas do dia atual
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.status !== "cancelled" && apt.date === today);

  // Calcular preços a partir da lista de serviços cadastrados
  const servicePriceMap = services.reduce((map, service) => {
    map[service.id] = service.price;
    return map;
  }, {} as Record<string, number>);

  const getAppointmentRevenue = (apt: any) => {
    return apt.services.reduce((serviceTotal: number, serviceId: string) => {
      return serviceTotal + (servicePriceMap[serviceId] || 0);
    }, 0);
  };

  const todayRevenue = todayAppointments.reduce((total, apt) => {
    return total + getAppointmentRevenue(apt);
  }, 0);

  // Horários de funcionamento (8h às 18h = 10 horas = 600 minutos)
  const workingMinutes = 600;
  const occupiedMinutes = todayAppointments.reduce((total: number, apt) => {
    const appointmentDuration = apt.services.reduce((sum: number, serviceId: string) => {
      const service = services.find((serviceItem) => serviceItem.id === serviceId);
      return sum + (service?.estimatedTime || 45);
    }, 0);
    return total + appointmentDuration;
  }, 0);
  const occupancyRate = Math.min((occupiedMinutes / workingMinutes) * 100, 100);

  // Estatísticas por horário
  const hourlyStats = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i; // 8h às 18h
    const appointmentsAtHour = todayAppointments.filter(apt => {
      const aptHour = parseInt(apt.time.split(':')[0]);
      return aptHour === hour;
    });
    return { hour, count: appointmentsAtHour.length };
  });

  const peakHour = hourlyStats.reduce((max, curr) => curr.count > max.count ? curr : max);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Estatísticas do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Estatísticas de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Agendamentos</p>
              <p className="text-3xl font-bold text-blue-900">{todayAppointments.length}</p>
              <p className="text-xs text-blue-700 mt-1">{todayAppointments.length === 0 ? 'Nenhum' : Math.round((todayAppointments.length / 10) * 100) + '% da capacidade'}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Taxa de Ocupação</p>
              <p className="text-3xl font-bold text-green-900">{Math.round(occupancyRate)}%</p>
              <p className="text-xs text-green-700 mt-1">{Math.floor(occupiedMinutes / 60)}h {occupiedMinutes % 60}min ocupado</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Receita Hoje</p>
              <p className="text-3xl font-bold text-purple-900">R$ {todayRevenue.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-purple-700 mt-1">{todayAppointments.length > 0 ? `R$ ${(todayRevenue / todayAppointments.length).toFixed(0)} por agendamento` : 'Sem receita'}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Horário de Pico</p>
              <p className="text-3xl font-bold text-yellow-900">{peakHour.hour}:00</p>
              <p className="text-xs text-yellow-700 mt-1">{peakHour.count} agendamento{peakHour.count !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Ocupação do Dia</span>
              <span className="text-sm text-gray-600">{Math.round(occupancyRate)}%</span>
            </div>
            <Progress value={occupancyRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Horário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Distribuição por Horário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hourlyStats.map(({ hour, count }) => {
              const percentageOfMax = todayAppointments.length > 0 ? (count / Math.max(...hourlyStats.map(h => h.count), 1)) * 100 : 0;
              const percentageOfDay = todayAppointments.length > 0 ? (count / todayAppointments.length) * 100 : 0;
              
              return (
                <div key={hour} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {hour}:00
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-6 relative">
                      <div
                        className={`h-6 rounded-full transition-all duration-500 ${
                          count > 0 ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${Math.min(percentageOfMax, 100)}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {count}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-xs font-medium text-gray-700">
                      {count > 0 ? `${Math.round(percentageOfDay)}%` : '0%'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Total de {todayAppointments.length} agendamento{todayAppointments.length !== 1 ? 's' : ''} hoje</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  Ocupado
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  Livre
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyStats;