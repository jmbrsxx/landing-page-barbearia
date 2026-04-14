import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Clock, MapPin, Phone } from "lucide-react";

interface ConfirmationPageProps {
  appointmentData: {
    name: string;
    phone: string;
    cpf?: string;
    email: string;
    barber: string;
    date: string;
    time: string;
    services: string[];
    notes?: string;
  };
  onNewAppointment?: () => void;
}

const ConfirmationPage = ({ appointmentData, onNewAppointment }: ConfirmationPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold mb-2">Agendamento Confirmado!</h1>
          <p className="text-gray-600">Seus dados foram salvos com sucesso. Confira os detalhes abaixo.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cliente Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-900">{appointmentData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {appointmentData.phone}
                  </p>
                </div>
                {appointmentData.cpf && (
                  <div>
                    <p className="text-sm text-gray-600">CPF</p>
                    <p className="font-medium text-gray-900">{appointmentData.cpf}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{appointmentData.email}</p>
                </div>
              </div>
            </div>

            {/* Barber Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Profissional</h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-600">Barbeiro</p>
                <p className="font-medium text-lg text-gray-900">{appointmentData.barber}</p>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Data e Horário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data
                  </p>
                  <p className="font-medium text-lg text-gray-900">
                    {new Date(appointmentData.date + "T00:00:00").toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horário
                  </p>
                  <p className="font-medium text-lg text-gray-900">{appointmentData.time}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Serviços Solicitados</h3>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                {appointmentData.services.map((service) => (
                  <Badge key={service} variant="secondary" className="text-base py-2 px-3">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes */}
            {appointmentData.notes && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Observações</h3>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-700">{appointmentData.notes}</p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Próximos Passos</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Seu agendamento foi salvo no sistema</li>
                <li>✓ Chegue com 10 minutos de antecedência</li>
                <li>✓ Você receberá um lembrete no dia do agendamento</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => navigate("/")} className="flex-1">
                Voltar para Início
              </Button>
              <Button onClick={onNewAppointment} variant="outline" className="flex-1">
                Novo Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmationPage;
