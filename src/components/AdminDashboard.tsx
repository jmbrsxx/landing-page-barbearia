import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
  Star,
  BarChart3,
  User
} from "lucide-react";
import { appointmentsService } from "@/services/appointmentsService";
import DailyStats from "./DailyStats";

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

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    averageRating: 4.8,
    uniqueClients: 0,
    monthlyGrowth: 15.3
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await appointmentsService.getAllConfirmedAppointments();
      setAppointments(data as Appointment[]);
      calculateStats(data as Appointment[]);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentsData: Appointment[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointmentsData.filter(apt => apt.date === today);

    // Calcular receita baseada nos serviços
    const servicePrices: { [key: string]: number } = {
      "Corte Masculino": 50,
      "Barba Completa": 35,
      "Corte + Barba": 75,
      "Tratamento Capilar": 60
    };

    const totalRevenue = appointmentsData.reduce((total, apt) => {
      const appointmentRevenue = apt.services.reduce((serviceTotal, service) => {
        return serviceTotal + (servicePrices[service] || 0);
      }, 0);
      return total + appointmentRevenue;
    }, 0);

    // Calcular clientes únicos
    const uniqueClients = new Set(appointmentsData.map(apt => apt.userId)).size;

    // Calcular crescimento mensal (simulado - últimos 30 dias vs anteriores)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAppointments = appointmentsData.filter(apt => {
      const aptDate = new Date(apt.createdAt?.toDate?.() || apt.createdAt);
      return aptDate >= thirtyDaysAgo;
    });

    const olderAppointments = appointmentsData.filter(apt => {
      const aptDate = new Date(apt.createdAt?.toDate?.() || apt.createdAt);
      return aptDate < thirtyDaysAgo;
    });

    const monthlyGrowth = olderAppointments.length > 0
      ? ((recentAppointments.length - olderAppointments.length) / olderAppointments.length) * 100
      : 0;

    setStats({
      totalAppointments: appointmentsData.length,
      todayAppointments: todayAppointments.length,
      totalRevenue,
      averageRating: 4.8, // Simulado
      uniqueClients,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100
    });
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue"
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Agendamentos"
          value={stats.totalAppointments}
          icon={Calendar}
          trend={`${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}% este mês`}
          color="blue"
        />
        <StatCard
          title="Agendamentos Hoje"
          value={stats.todayAppointments}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Clientes Únicos"
          value={stats.uniqueClients}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Dados da Barbearia</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nome:</span> BarberShop Canoas</p>
                <p><span className="font-medium">Email:</span> contato@barbershopcanoas.com</p>
                <p><span className="font-medium">Telefone:</span> (51) 99999-9999</p>
                <p><span className="font-medium">Endereço:</span> Rua das Flores, 123 - Canoas/RS</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Métricas Gerais</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Avaliação Média:</span>
                  <span className="flex items-center gap-1 ml-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {stats.averageRating}
                  </span>
                </p>
                <p><span className="font-medium">Taxa de Ocupação:</span> 85%</p>
                <p><span className="font-medium">Tempo Médio de Serviço:</span> 45 min</p>
                <p><span className="font-medium">Status:</span>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                    Ativo
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ganhos por Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Ganhos por Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Hoje</p>
              <p className="text-2xl font-bold text-blue-900">
                R$ {(stats.todayAppointments * 60).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Esta Semana</p>
              <p className="text-2xl font-bold text-green-900">
                R$ {(stats.totalRevenue * 0.3).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Este Mês</p>
              <p className="text-2xl font-bold text-purple-900">
                R$ {stats.totalRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clientes da Semana */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clientes da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {(() => {
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado

                const weekAppointments = appointments.filter(apt => {
                  const aptDate = new Date(apt.date);
                  return aptDate >= startOfWeek && aptDate <= endOfWeek;
                });

                return weekAppointments.length;
              })()}
            </div>
            <p className="text-gray-600">clientes agendados esta semana</p>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Detalhadas do Dia */}
      <DailyStats appointments={appointments} />
    </div>
  );
};

export default AdminDashboard;