import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const OwnerLoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      // Se já está logado, vai direto para o admin
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md mx-auto w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Acesso do Proprietário</CardTitle>
            <p className="text-muted-foreground">
              Faça login ou cadastre-se para acessar o painel administrativo
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowAuthModal(true)}
              className="w-full"
              size="lg"
            >
              Entrar / Cadastrar
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>

        {showAuthModal && (
          <AuthModal
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setShowAuthModal(false)}
            showBackToHome={true}
          />
        )}
      </div>
    </div>
  );
};

export default OwnerLoginPage;