import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  Star,
  BarChart3,
  User,
  Eye,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  UserCheck
} from "lucide-react";
import { appointmentsService, Service } from "@/services/appointmentsService";
import DailyStats from "./DailyStats";
import { useAuth } from "@/contexts/AuthContext";

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
  userId: string;
}

interface AdminDashboardProps {
  authenticated?: boolean;
}

const AdminDashboard = ({ authenticated = false }: AdminDashboardProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 4.8,
    uniqueClients: 0,
    monthlyGrowth: 15.3
  });

  useEffect(() => {
    if (authenticated) {
      setAuthError(null);
      loadDashboardData();
    } else {
      setAuthError("Você precisa estar autenticado para acessar o painel admin");
      setLoading(false);
    }
  }, [authenticated]);

  const loadDashboardData = async () => {
    console.log('loadDashboardData chamada');
    try {
      setLoading(true);
      setAuthError(null);

      // Primeiro tentar carregar dados reais do Firestore
      console.log('📊 Tentando carregar dados reais do Firestore...');
      try {
        const data = await appointmentsService.getAllActiveAppointments();
        const servicesData = await appointmentsService.getServices();

        console.log('✅ Dados carregados do Firestore:', {
          appointments: data.length,
          services: servicesData.length,
          today: new Date().toISOString().split('T')[0]
        });

        setAppointments(data as Appointment[]);
        setServices(servicesData);

        // Extrair usuários únicos dos agendamentos
        const uniqueUsers = await extractUsersFromAppointments(data as Appointment[]);
        setUsers(uniqueUsers);

        calculateStats(data as Appointment[], servicesData, uniqueUsers);
        return; // Sucesso, não usar mock
      } catch (firestoreError) {
        console.warn('⚠️ Erro ao carregar do Firestore, usando dados mock:', firestoreError);
        setAuthError("Usando dados de demonstração. Configure o Firebase para dados reais.");
      }

      // Fallback: usar dados mock se Firestore falhar
      console.log('🔧 Usando dados mock como fallback');
      const mockAppointments: Appointment[] = [
        {
          id: 'mock-1',
          name: 'João Silva',
          phone: '(51) 99999-9999',
          email: 'joao@email.com',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          barberId: 'barber-1',
          services: ['service-1'],
          notes: 'Cliente regular',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          userId: 'user-1'
        },
        {
          id: 'mock-2',
          name: 'Maria Santos',
          phone: '(51) 88888-8888',
          email: 'maria@email.com',
          date: new Date().toISOString().split('T')[0],
          time: '14:00',
          barberId: 'barber-1',
          services: ['service-2', 'service-3'],
          notes: '',
          status: 'completed',
          createdAt: new Date().toISOString(),
          userId: 'user-2'
        },
        {
          id: 'mock-3',
          name: 'Pedro Oliveira',
          phone: '(51) 77777-7777',
          email: 'pedro@email.com',
          date: new Date().toISOString().split('T')[0],
          time: '16:00',
          barberId: 'barber-2',
          services: ['service-1'],
          notes: 'Primeira vez',
          status: 'pending',
          createdAt: new Date().toISOString(),
          userId: 'user-3'
        }
      ];

      const mockServices: Service[] = [
        {
          id: 'service-1',
          name: 'Corte Masculino',
          price: 50,
          estimatedTime: 60
        },
        {
          id: 'service-2',
          name: 'Barba Completa',
          price: 35,
          estimatedTime: 30
        },
        {
          id: 'service-3',
          name: 'Corte + Barba',
          price: 75,
          estimatedTime: 90
        }
      ];

      setAppointments(mockAppointments);
      setServices(mockServices);

      console.log('Dados mock carregados:', {
        appointments: mockAppointments.length,
        services: mockServices.length,
        today: new Date().toISOString().split('T')[0]
      });

      // Extrair usuários únicos dos agendamentos
      const uniqueUsers = await extractUsersFromAppointments(mockAppointments);
      setUsers(uniqueUsers);

      calculateStats(mockAppointments, mockServices, uniqueUsers);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setAuthError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const extractUsersFromAppointments = async (appointmentsData: Appointment[]) => {
    const userMap = new Map();
    const uniqueUserIds = new Set(appointmentsData.map(apt => apt.userId));

    // Simular busca de perfis de usuários
    for (const userId of uniqueUserIds) {
      if (userId) {
        // Mock user data
        userMap.set(userId, {
          uid: userId,
          email: `${userId}@email.com`,
          displayName: `User ${userId}`,
          phone: '(51) 99999-9999',
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          },
          customClaims: {
            birthDate: '1990-01-01',
            howDidYouKnow: 'Indicação'
          }
        });
      }
    }

    return Array.from(userMap.values());
  };

  const calculateStats = (appointmentsData: Appointment[], serviceList: Service[], uniqueUsers: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const activeAppointments = appointmentsData.filter(apt => apt.status !== "cancelled");
    const todayAppointments = activeAppointments.filter(apt => apt.date === today);
    const completedAppointments = activeAppointments.filter(apt => apt.status === "completed");
    const completedToday = completedAppointments.filter(apt => apt.date === today);

    // Calcular receita
    let totalRevenue = 0;
    let todayRevenue = 0;

    activeAppointments.forEach(apt => {
      const appointmentRevenue = apt.services.reduce((sum, serviceId) => {
        const service = serviceList.find(s => s.id === serviceId);
        return sum + (service?.price || 0);
      }, 0);

      totalRevenue += appointmentRevenue;

      if (apt.date === today) {
        todayRevenue += appointmentRevenue;
      }
    });

    setStats({
      totalAppointments: activeAppointments.length,
      todayAppointments: todayAppointments.length,
      totalRevenue: totalRevenue,
      todayRevenue: todayRevenue,
      weeklyRevenue: totalRevenue * 0.3, // Estimativa semanal
      monthlyRevenue: totalRevenue * 1.2, // Estimativa mensal
      averageRating: 4.8,
      uniqueClients: uniqueUsers.length,
      monthlyGrowth: 15.3
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <CardTitle className="text-red-700">Erro de Autenticação</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{authError}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Agendamentos</p>
                <p className="text-3xl font-bold">{stats.totalAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                <p className="text-3xl font-bold">{stats.todayAppointments}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-3xl font-bold">R$ {stats.totalRevenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                <p className="text-3xl font-bold">{stats.uniqueClients}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <WeeklySchedule appointments={appointments} services={services} />

      {/* Daily Stats */}
      <DailyStats appointments={appointments} services={services} />
    </div>
  );
};

// Weekly Schedule Component
const WeeklySchedule = ({ appointments, services }: { appointments: Appointment[], services: Service[] }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // Calcular a semana baseada no offset (sábado a domingo)
  const getCurrentWeek = (offset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 6 = Sábado

    // Encontrar o sábado da semana atual (sábado que já passou ou é hoje)
    const saturday = new Date(today);
    if (currentDay === 6) { // Hoje é sábado
      saturday.setDate(today.getDate() + (offset * 7));
    } else {
      // Voltar para o sábado anterior
      const daysFromSaturday = currentDay + 1; // Sábado é 6, então de segunda (1) até sábado (6) = 1+1=2 dias para voltar
      saturday.setDate(today.getDate() - daysFromSaturday + (offset * 7));
    }
    saturday.setHours(0, 0, 0, 0); // Resetar horas

    // Criar array de dias da semana (sábado a domingo)
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(saturday);
      day.setDate(saturday.getDate() + i);
      weekDays.push(day);
    }

    return weekDays;
  };

  const weekDays = getCurrentWeek(weekOffset);

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr && apt.status !== 'cancelled');
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Calcular estatísticas da semana
  const weekStats = weekDays.reduce((stats, day) => {
    const dayAppointments = getAppointmentsForDay(day);
    stats.totalAppointments += dayAppointments.length;
    stats.confirmedAppointments += dayAppointments.filter(apt => apt.status === 'confirmed').length;
    stats.completedAppointments += dayAppointments.filter(apt => apt.status === 'completed').length;
    return stats;
  }, { totalAppointments: 0, confirmedAppointments: 0, completedAppointments: 0 });

  // Formatar período da semana
  const formatWeekPeriod = () => {
    const startDate = weekDays[0];
    const endDate = weekDays[6];
    const startStr = startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const endStr = endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${startStr} - ${endStr}`;
  };

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // Verificar se a semana mostrada contém hoje
  const isCurrentWeek = weekDays.some(day => day.toDateString() === new Date().toDateString());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agendamentos da Semana (Sábado a Domingo)
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Período: {formatWeekPeriod()}
              {isCurrentWeek && " (Semana Atual)"}
              {weekOffset === -1 && !isCurrentWeek && " (Semana Passada)"}
              {weekOffset === 1 && " (Próxima Semana)"}
              {Math.abs(weekOffset) > 1 && ` (${Math.abs(weekOffset)} semanas ${weekOffset > 0 ? 'à frente' : 'atrás'})`}
            </p>
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              <span>Total: {weekStats.totalAppointments} agendamentos</span>
              <span>Confirmados: {weekStats.confirmedAppointments}</span>
              <span>Concluídos: {weekStats.completedAppointments}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(prev => prev - 1)}
            >
              ← Semana Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
            >
              Semana Atual
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(prev => prev + 1)}
            >
              Próxima Semana →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`border rounded-lg p-4 ${isToday ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
              >
                <div className="text-center mb-3">
                  <h4 className={`font-semibold text-sm ${isToday ? 'text-primary' : 'text-amber-600'}`}>
                    {dayNames[day.getDay()]}
                  </h4>
                  <p className={`text-xs ${isToday ? 'text-primary' : 'text-gray-600'}`}>
                    {day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </p>
                  {isToday && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Hoje
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {dayAppointments.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Nenhum agendamento
                    </p>
                  ) : (
                    dayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`text-xs p-2 rounded border ${getStatusColor(appointment.status)}`}
                        >
                          <div className="font-medium">
                            {appointment.time} - {appointment.name}
                          </div>
                          <div className="text-gray-600 mt-1 truncate">
                            {appointment.services.map(getServiceName).join(', ')}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;