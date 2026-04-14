import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentsList from "@/components/AppointmentsList";
import AdminDashboard from "@/components/AdminDashboard";
import { CalendarCheck, BarChart3, Settings, LogOut, ArrowLeft, Lock, Trash2, Plus, Edit2 } from "lucide-react";
import { appointmentsService, Service, Barber } from "@/services/appointmentsService";

// Defina a chave de acesso aqui - pode ser alterada conforme necessário
const ADMIN_ACCESS_KEY = "admin2024";

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasValidAccess, setHasValidAccess] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");

  // Estados para Serviços
  const [services, setServices] = useState<Service[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: "", price: "", estimatedTime: "" });

  // Estados para Barbeiros
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [showBarberForm, setShowBarberForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [barberForm, setBarberForm] = useState({ name: "" });

  // Carregar dados
  useEffect(() => {
    if (hasValidAccess) {
      loadServices();
      loadBarbers();
    }
  }, [hasValidAccess]);

  const loadServices = async () => {
    try {
      const data = await appointmentsService.getServices();
      setServices(data);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
    }
  };

  const loadBarbers = async () => {
    try {
      const data = await appointmentsService.getBarbers();
      setBarbers(data);
    } catch (err) {
      console.error("Erro ao carregar barbeiros:", err);
    }
  };

  // Verificar se há um token válido na URL ou no localStorage
  useEffect(() => {
    const checkAccess = async () => {
      const params = new URLSearchParams(location.search);
      const keyFromUrl = params.get("key");

      // Verificar localStorage
      const storedAccess = localStorage.getItem("adminAccess");
      const expiresAt = localStorage.getItem("adminAccessExpires");

      // Se houver chave na URL
      if (keyFromUrl) {
        if (keyFromUrl === ADMIN_ACCESS_KEY) {
          // Apenas definir acesso sem login (usando dados mock)
          localStorage.setItem("adminAccess", "true");
          // Acesso válido por 24 horas
          localStorage.setItem(
            "adminAccessExpires",
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          );
          setHasValidAccess(true);
          // Limpar a URL
          window.history.replaceState(null, "", "/admin");
        } else {
          setError("Chave de acesso inválida");
        }
      }
      // Se houve acesso anterior no localStorage
      else if (storedAccess === "true" && expiresAt) {
        const expiration = new Date(expiresAt);
        if (new Date() < expiration) {
          setHasValidAccess(true);
        } else {
          localStorage.removeItem("adminAccess");
          localStorage.removeItem("adminAccessExpires");
        }
      }
    };

    checkAccess();
  }, [location]);

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (accessKey === ADMIN_ACCESS_KEY) {
      // Conceder acesso diretamente sem autenticação Firebase
      console.log('🔐 Acesso admin concedido com código válido');

      localStorage.setItem("adminAccess", "true");
      localStorage.setItem(
        "adminAccessExpires",
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      );
      setHasValidAccess(true);
      setAccessKey("");
    } else {
      setError("Chave de acesso inválida");
      setAccessKey("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAccess");
    localStorage.removeItem("adminAccessExpires");
    setHasValidAccess(false);
    setAccessKey("");
  };

  // ===== HANDLERS DE SERVIÇOS =====
  const handleSaveService = async () => {
    if (!serviceForm.name || !serviceForm.price || !serviceForm.estimatedTime) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const newService = {
        name: serviceForm.name,
        price: parseFloat(serviceForm.price),
        estimatedTime: parseInt(serviceForm.estimatedTime),
      };

      if (editingService) {
        await appointmentsService.updateService(editingService.id, newService);
      } else {
        await appointmentsService.addService(newService);
      }

      setServiceForm({ name: "", price: "", estimatedTime: "" });
      setShowServiceForm(false);
      setEditingService(null);
      await loadServices();
    } catch (err) {
      alert("Erro ao salvar serviço");
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este serviço?")) return;
    try {
      await appointmentsService.deleteService(id);
      await loadServices();
    } catch (err) {
      alert("Erro ao deletar serviço");
      console.error(err);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      price: service.price.toString(),
      estimatedTime: service.estimatedTime.toString(),
    });
    setShowServiceForm(true);
  };

  // ===== HANDLERS DE BARBEIROS =====
  const handleSaveBarber = async () => {
    if (!barberForm.name) {
      alert("Digite o nome do barbeiro");
      return;
    }

    try {
      if (editingBarber) {
        await appointmentsService.updateBarber(editingBarber.id, { name: barberForm.name });
      } else {
        await appointmentsService.addBarber({ name: barberForm.name });
      }

      setBarberForm({ name: "" });
      setShowBarberForm(false);
      setEditingBarber(null);
      await loadBarbers();
    } catch (err) {
      alert("Erro ao salvar barbeiro");
      console.error(err);
    }
  };

  const handleDeleteBarber = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este barbeiro?")) return;
    try {
      await appointmentsService.deleteBarber(id);
      await loadBarbers();
    } catch (err) {
      alert("Erro ao deletar barbeiro");
      console.error(err);
    }
  };

  const handleEditBarber = (barber: Barber) => {
    setEditingBarber(barber);
    setBarberForm({ name: barber.name });
    setShowBarberForm(true);
  };

  // Se não tem acesso, mostrar formulário
  if (!hasValidAccess) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 max-w-md">
          <Card>
            <CardHeader className="relative text-center">
              <div className="flex items-center justify-center mb-4">
                <Lock className="w-12 h-12 text-primary" />
              </div>
              <CardTitle>Acesso ao Painel Administrativo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-center text-sm">
                Digite a chave de acesso para entrar no painel administrativo.
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleAccessSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="accessKey">Chave de Acesso</Label>
                  <Input
                    id="accessKey"
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="Digite a chave"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Acessar Painel
                </Button>
              </form>

              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Se tem acesso, mostrar painel administrativo
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
                onClick={handleLogout}
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
            <AdminDashboard authenticated={true} />
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
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="barbers">Barbeiros</TabsTrigger>
              </TabsList>

              {/* SERVIÇOS */}
              <TabsContent value="services">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gerenciar Serviços</CardTitle>
                    {!showServiceForm && (
                      <Button onClick={() => setShowServiceForm(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Serviço
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {showServiceForm && (
                      <div className="p-4 bg-blue-50 rounded-lg space-y-4 border border-blue-200">
                        <h4 className="font-semibold text-blue-900">
                          {editingService ? "Editar Serviço" : "Novo Serviço"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-900">Nome do Serviço</Label>
                            <Input
                              value={serviceForm.name}
                              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                              placeholder="Ex: Corte Masculino"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-900">Preço (R$)</Label>
                            <Input
                              type="number"
                              value={serviceForm.price}
                              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                              placeholder="50"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-900">Tempo Estimado (minutos)</Label>
                            <Input
                              type="number"
                              value={serviceForm.estimatedTime}
                              onChange={(e) => setServiceForm({ ...serviceForm, estimatedTime: e.target.value })}
                              placeholder="45"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveService} className="flex-1">
                            Salvar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowServiceForm(false);
                              setEditingService(null);
                              setServiceForm({ name: "", price: "", estimatedTime: "" });
                            }}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {services.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">Nenhum serviço cadastrado</p>
                      ) : (
                        services.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{service.name}</p>
                              <p className="text-sm text-gray-600">
                                R$ {service.price.toFixed(2)} • {service.estimatedTime} min
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditService(service)}
                                className="flex items-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Deletar
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* BARBEIROS */}
              <TabsContent value="barbers">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gerenciar Barbeiros</CardTitle>
                    {!showBarberForm && (
                      <Button onClick={() => setShowBarberForm(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Novo Barbeiro
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {showBarberForm && (
                      <div className="p-4 bg-green-50 rounded-lg space-y-4 border border-green-200">
                        <h4 className="font-semibold text-green-900">
                          {editingBarber ? "Editar Barbeiro" : "Novo Barbeiro"}
                        </h4>
                        <div>
                          <Label className="text-gray-900">Nome do Barbeiro</Label>
                          <Input
                            value={barberForm.name}
                            onChange={(e) => setBarberForm({ name: e.target.value })}
                            placeholder="Ex: João Silva"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveBarber} className="flex-1">
                            Salvar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowBarberForm(false);
                              setEditingBarber(null);
                              setBarberForm({ name: "" });
                            }}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {barbers.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">Nenhum barbeiro cadastrado</p>
                      ) : (
                        barbers.map((barber) => (
                          <div
                            key={barber.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                          >
                            <p className="font-semibold text-gray-900">{barber.name}</p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBarber(barber)}
                                className="flex items-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteBarber(barber.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Deletar
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
