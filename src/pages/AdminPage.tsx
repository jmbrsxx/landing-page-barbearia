import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentsList from "@/components/AppointmentsList";
import AdminDashboard from "@/components/AdminDashboard";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarCheck, BarChart3, Settings, LogOut, ArrowLeft } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Login Necessário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Para acessar o painel administrativo, você precisa entrar ou criar uma conta.
              </p>
              <Button onClick={() => setShowAuthModal(true)} className="w-full">
                Entrar / Cadastrar
              </Button>
            </CardContent>
          </Card>
          {showAuthModal && <AuthModal onAuthSuccess={() => setShowAuthModal(false)} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
                <CalendarCheck className="w-10 h-10 text-green-600" />
                Painel Administrativo
              </h1>
              <p className="text-gray-600">Gerencie seu negócio e acompanhe o desempenho</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Olá,</p>
                <p className="font-semibold text-white">
                  {user.displayName || user.email?.split('@')[0]}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentsList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Barbearia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-4">Informações Básicas</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Nome da Barbearia</label>
                        <p className="text-sm text-gray-600">BarberShop Canoas</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-600">contato@barbershopcanoas.com</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Telefone</label>
                        <p className="text-sm text-gray-600">(51) 99999-9999</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-4">Horário de Funcionamento</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Segunda - Sexta:</span> 09:00 - 19:00</p>
                      <p><span className="font-medium">Sábado:</span> 08:00 - 17:00</p>
                      <p><span className="font-medium">Domingo:</span> Fechado</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-white mb-4">Serviços Oferecidos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-500 rounded">
                      <span className="text-sm">Corte Masculino</span>
                      <span className="font-semibold">R$ 50</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-500 rounded">
                      <span className="text-sm">Barba Completa</span>
                      <span className="font-semibold">R$ 35</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-500 rounded">
                      <span className="text-sm">Corte + Barba</span>
                      <span className="font-semibold">R$ 75</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-500 rounded">
                      <span className="text-sm">Tratamento Capilar</span>
                      <span className="font-semibold">R$ 60</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
