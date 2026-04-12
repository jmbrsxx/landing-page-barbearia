import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, actionCodeSettings } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Chrome, Mail, X } from "lucide-react";

interface AuthModalProps {
  onAuthSuccess: () => void;
  onClose?: () => void;
  showBackToHome?: boolean;
}

const AuthModal = ({ onAuthSuccess, onClose, showBackToHome = false }: AuthModalProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<"google" | "email">("google");

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar com Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Digite seu email para recuperar a conta.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage("✓ Email enviado com sucesso! Verifique sua caixa de entrada e pasta de spam.");
      setEmail("");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Este email não tem uma conta registrada.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido. Digite um email válido.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
      } else {
        setError(err.message || "Não foi possível enviar o email de recuperação.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      setIsLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setError("Senha incorreta. Verifique e tente novamente.");
      } else if (err.code === "auth/user-not-found") {
        setError("Email não encontrado. Verifique e tente novamente.");
      } else {
        setError(err.message || "Erro ao fazer login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <Card className="relative w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="relative">
          <CardTitle className="text-center">Login</CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Opção entre Google e Email */}
          <div className="flex gap-2">
            <Button
              variant={authMode === "google" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setAuthMode("google")}
            >
              Google
            </Button>
            <Button
              variant={authMode === "email" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setAuthMode("email")}
            >
              Email
            </Button>
          </div>

          {authMode === "google" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Faça login com sua conta Google para continuar.
              </p>
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Chrome className="w-4 h-4" />
                {isLoading ? "Autenticando..." : "Entrar com Google"}
              </Button>
              {showBackToHome && (
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  className="w-full"
                >
                  Voltar ao Início
                </Button>
              )}
            </div>
          )}

          {authMode === "email" && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm text-primary underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AuthModal;
