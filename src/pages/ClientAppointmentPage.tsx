import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Scissors, Clock, AlertCircle, ArrowLeft, ChevronRight } from "lucide-react";
import TimeSlotSelector from "@/components/TimeSlotSelector";
import DatePicker from "@/components/DatePicker";
import ConfirmationPage from "@/components/ConfirmationPage";
import { appointmentsService, Service, Barber } from "@/services/appointmentsService";

const ClientAppointmentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Barbeiro, 2: Serviço, 3: Data, 4: Hora, 5: Dados
  const [confirmationData, setConfirmationData] = useState<any>(null);

  // Dados
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);

  // Seleções
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Formulário
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cpf: "",
    email: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar barbeiros e serviços
  useEffect(() => {
    loadData();
  }, []);

  // Carregar horários reservados quando data ou barbeiro mudar
  useEffect(() => {
    if (selectedDate && selectedBarber) {
      loadReservedSlots();
    }
  }, [selectedDate, selectedBarber]);

  const loadData = async () => {
    try {
      const [barbersData, servicesData] = await Promise.all([
        appointmentsService.getBarbers(),
        appointmentsService.getServices(),
      ]);
      setBarbers(barbersData);
      setServices(servicesData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados. Tente novamente.");
    }
  };

  const loadReservedSlots = async () => {
    if (!selectedBarber) return;
    try {
      const slots = await appointmentsService.getReservedSlotsByBarber(selectedBarber.id, selectedDate);
      setReservedSlots(slots);
    } catch (err) {
      console.error("Erro ao carregar horários:", err);
    }
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedBarber) {
      alert("Selecione um barbeiro");
      return;
    }
    if (step === 2 && selectedServices.length === 0) {
      alert("Selecione pelo menos um serviço");
      return;
    }
    if (step === 3 && !selectedDate) {
      alert("Selecione uma data");
      return;
    }
    if (step === 4 && !selectedTime) {
      alert("Selecione um horário");
      return;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (!selectedBarber) {
      alert("Selecione um barbeiro");
      return;
    }

    try {
      setIsSubmitting(true);
      const appointmentId = await appointmentsService.createAppointment({
        userId: null,
        name: formData.name,
        phone: formData.phone,
        cpf: formData.cpf,
        email: formData.email,
        date: selectedDate,
        time: selectedTime,
        barberId: selectedBarber.id,
        services: selectedServices,
        notes: formData.notes,
        status: "confirmed",
      });

      console.log("Agendamento criado:", appointmentId);

      setConfirmationData({
        ...formData,
        barber: selectedBarber.name,
        services: selectedServices.map(serviceId => {
          const service = services.find(s => s.id === serviceId);
          return service ? `${service.name} (${service.estimatedTime} min)` : serviceId;
        }),
        date: selectedDate,
        time: selectedTime,
      });
    } catch (error: any) {
      setError(error.message || "Erro ao criar agendamento");
      alert("Erro ao criar agendamento: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewAppointment = () => {
    setConfirmationData(null);
    setStep(1);
    setSelectedBarber(null);
    setSelectedServices([]);
    setSelectedDate("");
    setSelectedTime("");
    setFormData({ name: "", phone: "", cpf: "", email: "", notes: "" });
    setError(null);
  };

  if (confirmationData) {
    return <ConfirmationPage appointmentData={confirmationData} onNewAppointment={handleNewAppointment} />;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Agendar Consulta</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-primary">{step}</span>
            <span>de</span>
            <span>5</span>
          </div>
        </div>

        {/* Indicador de Progresso */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Card>
          {error && (
            <div className="m-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* STEP 1: SELECIONAR BARBEIRO */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Escolha seu Barbeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">Qual barbeiro você prefere?</p>

                {barbers.length === 0 ? (
                  <p className="text-center py-8 text-gray-600">Nenhum barbeiro disponível</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {barbers.map((barber) => (
                      <button
                        key={barber.id}
                        onClick={() => setSelectedBarber(barber)}
                        className={`p-4 border-2 rounded-lg transition flex items-center justify-between ${
                          selectedBarber?.id === barber.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary"
                        }`}
                      >
                        <span className="font-semibold">{barber.name}</span>
                        {selectedBarber?.id === barber.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </>
          )}

          {/* STEP 2: SELECIONAR SERVIÇOS */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Escolha o Serviço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">Quais serviços deseja realizar com {selectedBarber?.name}?</p>

                {services.length === 0 ? (
                  <p className="text-center py-8 text-gray-600">Nenhum serviço disponível</p>
                ) : (
                  <div className="space-y-3">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className="group flex items-start gap-3 p-4 border rounded-lg bg-white hover:bg-primary/10 cursor-pointer transition"
                      >
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={(checked) =>
                            handleServiceChange(service.id, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-500 transition-colors group-hover:text-primary">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            R$ {service.price.toFixed(2)} • {service.estimatedTime} minutos
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {selectedServices.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-900">
                      <strong>Total estimado:</strong> R${" "}
                      {services
                        .filter((s) => selectedServices.includes(s.id))
                        .reduce((sum, s) => sum + s.price, 0)
                        .toFixed(2)}{" "}
                      • {" "}
                      {services
                        .filter((s) => selectedServices.includes(s.id))
                        .reduce((sum, s) => sum + s.estimatedTime, 0)}{" "}
                      minutos
                    </p>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {/* STEP 3: SELECIONAR DATA */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Escolha a Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="date">Data do Agendamento</Label>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minDate={getTodayDate()}
                    className="text-primary border-primary/70 hover:bg-primary/10"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 4: SELECIONAR HORA */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Escolha o Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSlotSelector
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  reservedSlots={reservedSlots}
                />
              </CardContent>
            </>
          )}

          {/* STEP 5: CONFIRMAÇÃO E DADOS */}
          {step === 5 && (
            <>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Alguma observação especial?"
                      rows={3}
                    />
                  </div>

                  {/* Resumo */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <p className="font-semibold text-blue-900">Resumo do Agendamento</p>
                    <p className="text-sm text-gray-900">
                      <strong>Barbeiro:</strong> {selectedBarber?.name}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Serviço(s):</strong>{" "}
                      {services
                        .filter((s) => selectedServices.includes(s.id))
                        .map((s) => s.name)
                        .join(", ")}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Data:</strong> {new Date(selectedDate).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Horário:</strong> {selectedTime}
                    </p>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {/* Botões de Navegação */}
          <CardContent className="flex gap-2 justify-between pt-6 border-t mt-6 pb-6">
            <Button
              variant="outline"
              onClick={() => (step === 1 ? navigate("/") : handlePrevStep())}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <Button
              onClick={handleNextStep}
              className="flex items-center gap-2 flex-1"
              disabled={
                isSubmitting ||
                (step === 1 && !selectedBarber) ||
                (step === 2 && selectedServices.length === 0) ||
                (step === 3 && !selectedDate) ||
                (step === 4 && !selectedTime) ||
                (step === 5 && (!formData.name || !formData.phone || !formData.email))
              }
            >
              {step === 5
                ? isSubmitting
                  ? "Agendando..."
                  : "Confirmar Agendamento"
                : "Próximo"}
              {step < 5 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientAppointmentPage;