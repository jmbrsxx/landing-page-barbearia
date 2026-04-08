import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Sparkles, Wind, Droplets, Clock, AlertCircle } from "lucide-react";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import AuthModal from "@/components/AuthModal";
import ConfirmationPage from "@/components/ConfirmationPage";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentsService } from "@/services/appointmentsService";

const services = [
  {
    icon: Scissors,
    title: "Corte Masculino",
    desc: "Corte personalizado com técnicas modernas e acabamento impecável.",
    price: "R$ 50",
  },
  {
    icon: Sparkles,
    title: "Barba Completa",
    desc: "Modelagem e aparagem com navalha, toalha quente e hidratação.",
    price: "R$ 35",
  },
  {
    icon: Wind,
    title: "Corte + Barba",
    desc: "O combo completo para o homem que valoriza cada detalhe.",
    price: "R$ 75",
  },
  {
    icon: Droplets,
    title: "Tratamento Capilar",
    desc: "Hidratação profunda e tratamentos para couro cabeludo saudável.",
    price: "R$ 60",
  },
];

const AppointmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleServiceChange = (serviceTitle: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceTitle]);
    } else {
      setSelectedServices(selectedServices.filter(s => s !== serviceTitle));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Obter data de hoje em formato YYYY-MM-DD para o atributo min
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!formData.date || !formData.time) {
      alert("Por favor, selecione uma data e horário");
      return;
    }

    if (selectedServices.length === 0) {
      alert("Por favor, selecione pelo menos um serviço");
      return;
    }

    try {
      setIsSubmitting(true);
      const appointmentId = await appointmentsService.createAppointment({
        userId: user.uid,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        services: selectedServices,
        notes: formData.notes,
        status: "confirmed",
      });

      console.log("Agendamento criado com sucesso:", appointmentId);

      // Mostrar página de confirmação APÓS sucesso
      setConfirmationData({
        ...formData,
        services: selectedServices,
      });
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);
      setError(error.message || "Erro ao criar agendamento. Tente novamente.");
      alert("Erro ao criar agendamento: " + (error.message || "Erro desconhecido"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    // Tenta enviar novamente após autenticação
    const form = new FormData();
    form.set("submitEvent", "true");
    handleSubmit(new Event("submit") as any);
  };

  if (confirmationData) {
    return <ConfirmationPage appointmentData={confirmationData} />;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-8">Agendar Consulta</h1>
        <Card>
          <CardHeader>
            <CardTitle>Preencha os detalhes da sua consulta</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    min={getTodayDate()}
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <TimeSlotSelector 
                selectedDate={formData.date} 
                selectedTime={formData.time}
                onTimeSelect={(time) => setFormData({ ...formData, time })}
              />
              <div>
                <Label>Serviços</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {services.map((service) => (
                    <div key={service.title} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.title}
                        checked={selectedServices.includes(service.title)}
                        onCheckedChange={(checked) => handleServiceChange(service.title, checked as boolean)}
                      />
                      <Label htmlFor={service.title} className="flex items-center gap-2">
                        <service.icon className="w-4 h-4" />
                        {service.title} - {service.price}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Alguma observação adicional..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processando..." : "Agendar Consulta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {showAuthModal && <AuthModal onAuthSuccess={handleAuthSuccess} />}
    </div>
  );
};

export default AppointmentPage;