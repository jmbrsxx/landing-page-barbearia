import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, User, Shield, ArrowLeft } from "lucide-react";

const ChooseTypePage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-6">
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
          <span className="gold-text">Barber</span>
          <span className="text-foreground">Shop</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          Experiência premium em corte masculino. Escolha como deseja acessar nossos serviços.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Agende seu horário sem cadastro. Simples e rápido.
            </p>
            <Link to="/cliente">
              <Button className="w-full">
                Entrar como Cliente
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <CardTitle>Proprietário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Acesse o painel administrativo para gerenciar agendamentos.
            </p>
            <Link to="/proprietario">
              <Button variant="outline" className="w-full">
                Entrar como Proprietário
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default ChooseTypePage;