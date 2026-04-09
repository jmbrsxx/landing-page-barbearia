import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth, actionCodeSettings } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mounted, setMounted] = useState(false);

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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
      }
      setMessage("Conta criada com sucesso! Verifique seu email para ativar a conta.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está cadastrado. Faça login ou recupere sua senha.");
      } else {
        setError(err.message || "Erro ao criar conta");
      }
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
      console.log("Iniciando recuperação de senha para:", email);
      console.log("Auth configurado:", auth);
      console.log("ActionCodeSettings:", actionCodeSettings);
      const result = await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log("Email de recuperação enviado com sucesso!", result);
      setMessage("✓ Email enviado com sucesso! Verifique sua caixa de entrada e pasta de spam.");
      setEmail("");
    } catch (err: any) {
      console.error("Erro completo:", err);
      console.error("Código de erro:", err.code);
      console.error("Mensagem de erro:", err.message);
      if (err.code === "auth/user-not-found") {
        setError("❌ Este email não tem uma conta registrada. Crie uma conta primeiro.");
      } else if (err.code === "auth/invalid-email") {
        setError("❌ Email inválido. Digite um email válido.");
      } else if (err.code === "auth/too-many-requests") {
        setError("❌ Muitas tentativas. Aguarde alguns minutos e tente novamente.");
      } else {
        setError(`❌ Erro: ${err.code || "desconhecido"} - ${err.message || "Não foi possível enviar o email de recuperação. Tente novamente."}`);
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
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (!credential.user.emailVerified) {
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setError("Email não verificado. Enviamos um novo email de verificação.");
        return;
      }
      onAuthSuccess();
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setError("Senha incorreta. Verifique e tente novamente.");
      } else if (err.code === "auth/user-not-found") {
        setError("Email não encontrado. Crie uma conta ou recupere sua senha.");
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
          <CardTitle className="text-center">Autenticação Necessária</CardTitle>
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

          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            {/* Google Sign In */}
            <TabsContent value="google" className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Entre ou crie uma conta com sua conta Google para continuar com o agendamento.
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
            </TabsContent>

            {/* Email Sign Up/In */}
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm sua senha"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

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
                  variant="outline"
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AuthModal;
