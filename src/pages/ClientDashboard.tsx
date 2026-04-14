import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  Scissors,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentsService } from "@/services/appointmentsService";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar";
import { deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface Appointment {
  id: string;
  date: string;
  time: string;
  barberId: string;
  barberName: string;
  services: string[];
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    } else if (user) {
      loadUserData();
    }
  }, [user, loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "services" || tab === "profile") {
      setActiveTab(tab);
    } else {
      setActiveTab("appointments");
    }
  }, [location.search]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Carregar agendamentos do usuário
      const userAppointments = (await appointmentsService.getUserAppointments(user.uid)) as Appointment[];
      setAppointments(userAppointments);

      // Carregar serviços disponíveis
      const availableServices = await appointmentsService.getServices();
      setServices(availableServices);

      // Carregar perfil do usuário
      const profile = await appointmentsService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    loadUserData();
  };

  const handleLogout = async () => {
    try {
      await appointmentsService.signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Esta ação é permanente. Deseja realmente deletar sua conta e todos os seus dados?\n\n" +
      "Será necessário fazer login novamente para confirmar a exclusão."
    );

    if (!confirmDelete) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Não foi possível identificar seu usuário. Faça login novamente e tente novamente.");
        return;
      }

      console.log("🗑️ Iniciando deleção de conta para:", currentUser.uid);

      // PASSO 1: Deletar todos os agendamentos do usuário
      console.log("📋 Passo 1: Deletando agendamentos...");
      const userAppointments = await appointmentsService.getUserAppointments(currentUser.uid);
      for (const appointment of userAppointments) {
        await appointmentsService.deleteAppointment(appointment.id);
      }
      console.log("✅ Agendamentos deletados:", userAppointments.length);

      // PASSO 2: Deletar perfil do usuário NO FIRESTORE (ANTES de deletar a conta)
      console.log("👤 Passo 2: Deletando perfil no Firestore...");
      try {
        await appointmentsService.deleteUserProfile(currentUser.uid);
        console.log("✅ Perfil deletado com sucesso");
      } catch (error: any) {
        console.error("❌ Erro ao deletar perfil:", error);
        if (error.code !== 'not-found') {
          throw error;
        }
      }

      // PASSO 3: FAZER LOGOUT PRIMEIRO (para limpar cache)
      console.log("🔐 Passo 3: Fazendo logout temporário...");
      await appointmentsService.signOut();

      // PASSO 4: FAZER LOGIN NOVAMENTE (reautenticação obrigatória)
      const email = currentUser.email;
      const password = prompt("🔑 Para confirmar a exclusão, digite sua senha novamente:");

      if (!password) {
        alert("❌ Exclusão cancelada. Senha não fornecida.");
        return;
      }

      console.log("🔐 Passo 4: Reautenticando...");
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email!, password);
      console.log("✅ Reautenticação bem-sucedida");

      // PASSO 5: AGORA SIM, DELETAR A CONTA
      console.log("🗑️ Passo 5: Deletando conta do Firebase Auth...");
      const { deleteUser } = await import('firebase/auth');
      await deleteUser(auth.currentUser!);
      console.log("✅ Conta do Firebase deletada com sucesso");

      navigate("/");
      alert("✅ Conta deletada com sucesso. Todos os seus dados foram removidos permanentemente.");
    } catch (error: any) {
      console.error("❌ Erro ao deletar conta:", error);

      if (error.code === 'auth/wrong-password') {
        alert("❌ Senha incorreta. Exclusão cancelada.");
      } else if (error.code === 'auth/too-many-requests') {
        alert("❌ Muitas tentativas. Aguarde alguns minutos e tente novamente.");
      } else if (error.code === 'auth/user-token-expired') {
        alert("❌ Sessão expirada. Faça login novamente e tente excluir a conta.");
      } else {
        alert("❌ Erro ao deletar conta: " + (error.message || "Erro desconhecido") + "\n\nTente novamente ou entre em contato conosco.");
      }
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find((serviceItem) => serviceItem.id === serviceId);
    return service ? service.name : serviceId;
  };

  const updateAppointmentStatus = async (appointmentId: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      await appointmentsService.updateAppointmentStatus(appointmentId, status);
      await loadUserData();
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error);
    }
  };

  const removeAppointment = async (appointmentId: string) => {
    if (!window.confirm("Deseja realmente remover este agendamento?")) {
      return;
    }

    try {
      await appointmentsService.deleteAppointment(appointmentId);
      await loadUserData();
    } catch (error) {
      console.error("Erro ao remover agendamento:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Acesso necessário</h1>
              <p className="text-gray-600 mb-6">Faça login para acessar seu painel</p>
              <Button onClick={() => setShowAuthModal(true)}>
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
        {showAuthModal && (
          <AuthModal
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background pl-80">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold">
                  Olá, {user.displayName || "Cliente"}!
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Início
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">
              {activeTab === "appointments" && "Meus Agendamentos"}
              {activeTab === "services" && "Nossos Serviços"}
              {activeTab === "profile" && "Minha Conta"}
            </h2>
            {activeTab === "appointments" && appointments.length > 0 && (
              <div className="flex justify-start">
                <Button
                  onClick={() => navigate("/cliente")}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Agendamento
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Você ainda não tem agendamentos</p>
                    <Button onClick={() => navigate("/cliente")}>
                      Fazer Primeiro Agendamento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          {getStatusIcon(appointment.status)}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {new Date(appointment.date + "T00:00:00").toLocaleDateString("pt-BR")}
                              {" às "}
                              {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              Barbeiro: {appointment.barberName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Serviços: {appointment.services.map(getServiceName).join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-3 mt-4 md:mt-0">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {appointment.status !== "confirmed" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                              >
                                Confirmar
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, "pending")}
                              >
                                Desconfirmar
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeAppointment(appointment.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                    >
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-2">{service.estimatedTime} minutos</p>
                      <p className="text-primary font-semibold">R$ {service.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nome</label>
                    <p className="text-gray-600">{userProfile?.displayName || user?.displayName || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-600">{userProfile?.email || user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Telefone</label>
                    <p className="text-gray-600">{userProfile?.phone || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                    <p className="text-gray-600">{userProfile?.birthDate || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Como nos conheceu</label>
                    <p className="text-gray-600">{userProfile?.howDidYouKnow || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ID do Usuário</label>
                    <p className="text-gray-600 text-sm">{user?.uid}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Data de Cadastro</label>
                    <p className="text-gray-600">
                      {user?.metadata.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString("pt-BR")
                        : "Não disponível"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-red-200">
                  <h4 className="font-medium text-red-600 mb-2">Zona de Perigo</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Ações irreversíveis. Tenha certeza antes de prosseguir.
                  </p>
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium text-red-800 mb-2">Deletar Conta</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Esta ação irá permanentemente deletar sua conta e todos os seus dados,
                      incluindo agendamentos, histórico e informações pessoais. Esta ação não pode ser desfeita.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Deletar Minha Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <Sidebar />
    </div>
  );
};

export default ClientDashboard;