import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppointmentsList from "@/components/AppointmentsList";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarCheck } from "lucide-react";

const AdminPage = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
                Para ver e gerenciar agendamentos, você precisa entrar ou criar uma conta.
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
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
            <CalendarCheck className="w-10 h-10 text-green-600" />
            Painel de Agendamentos
          </h1>
          <p className="text-gray-600">Gerenciar as consultas agendadas pelos clientes</p>
        </div>

        <AppointmentsList />
      </div>
    </div>
  );
};

export default AdminPage;
