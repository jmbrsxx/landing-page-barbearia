import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, X } from 'lucide-react';
import DatePicker from '@/components/DatePicker';
import { appointmentsService } from '@/services/appointmentsService';

interface AuthModalProps {
  onAuthSuccess: () => void;
  onClose?: () => void;
}

const AuthModal = ({ onAuthSuccess, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [howDidYouKnow, setHowDidYouKnow] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Digite seu nome completo');
      return;
    }

    if (!email.trim()) {
      setError('Digite seu email');
      return;
    }

    if (!phone.trim()) {
      setError('Digite seu telefone');
      return;
    }

    if (!birthDate) {
      setError('Selecione sua data de nascimento');
      return;
    }

    if (!howDidYouKnow) {
      setError('Selecione como nos conheceu');
      return;
    }

    if (!acceptTerms) {
      setError('Você deve aceitar os termos de uso');
      return;
    }

    if (!acceptPrivacy) {
      setError('Você deve aceitar a política de privacidade');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      // Salvar dados do perfil do usuário
      await appointmentsService.saveUserProfile(userCredential.user.uid, {
        email: email.trim(),
        displayName: name.trim(),
        phone: phone.trim(),
        birthDate: birthDate,
        howDidYouKnow: howDidYouKnow,
      });

      onAuthSuccess();
    } catch (err: any) {
      console.error('❌ Erro no cadastro:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado. Tente fazer login ou recupere sua senha.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido. Digite um email válido.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-password') {
        setError('Dados de autenticação inválidos. Tente novamente.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Erro de rede. Verifique sua conexão e tente novamente.');
      } else {
        setError(err.message || 'Erro ao criar conta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Digite seu email');
      return;
    }

    if (!password) {
      setError('Digite sua senha');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta. Verifique e tente novamente.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Email não encontrado. Verifique e tente novamente.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-password') {
        setError('Email ou senha inválidos. Verifique e tente novamente.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas de login. Tente mais tarde.');
      } else {
        setError(err.message || 'Erro ao fazer login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resetEmail.trim()) {
      setError('Digite seu email para recuperar a senha');
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setShowResetPassword(false);
        setResetEmail('');
        setResetSuccess(false);
      }, 3000);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('Email não encontrado no sistema.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido. Digite um email válido.');
      } else {
        setError(err.message || 'Erro ao enviar email de recuperação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4' onClick={onClose}>
      <Card className='relative w-full max-w-md overflow-hidden' onClick={(e) => e.stopPropagation()}>
        <CardHeader className='relative'>
          <CardTitle className='text-center'>
            {showResetPassword ? 'Recuperar Senha' : (isSignUp ? 'Cadastrar' : 'Entrar')}
          </CardTitle>
          {onClose && (
            <Button
              variant='ghost'
              size='sm'
              className='absolute right-2 top-2 h-8 w-8 p-0'
              onClick={onClose}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </CardHeader>
        <CardContent className='space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto'>
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2'>
              <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          )}

          {resetSuccess && (
            <div className='p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2'>
              <AlertCircle className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-green-700'>Email de recuperação enviado! Verifique sua caixa de entrada.</p>
            </div>
          )}

          {showResetPassword ? (
            <>
              <form onSubmit={handleResetPassword} className='space-y-4'>
                <div className='text-sm text-gray-600 mb-4'>
                  Digite seu email para receber um link de recuperação de senha.
                </div>
                
                <div>
                  <Label htmlFor='resetEmail'>Email</Label>
                  <Input
                    id='resetEmail'
                    type='email'
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder='Digite seu email'
                    required
                  />
                </div>

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Email de Recuperação'}
                </Button>
              </form>

              <div className='text-center'>
                <Button
                  variant='link'
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetEmail('');
                    setError(null);
                  }}
                  className='text-sm'
                >
                  Voltar ao Login
                </Button>
              </div>
            </>
          ) : isSignUp ? (
            <form onSubmit={handleSignUp} className='space-y-4'>
              <div>
                <Label htmlFor='name'>Nome completo *</Label>
                <Input
                  id='name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Digite seu nome completo'
                  required
                />
              </div>

              <div>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Digite seu email'
                  required
                />
              </div>

              <div>
                <Label htmlFor='phone'>Telefone *</Label>
                <Input
                  id='phone'
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='Digite seu telefone'
                  required
                />
              </div>

              <div>
                <Label htmlFor='birthDate'>Data de nascimento *</Label>
                <DatePicker
                  value={birthDate}
                  onChange={setBirthDate}
                  placeholder="Selecione sua data de nascimento"
                  minDate="1900-01-01"
                  className="bg-background hover:bg-primary/10 border-primary/70 text-primary"
                />
              </div>

              <div>
                <Label htmlFor='howDidYouKnow'>Como nos conheceu? *</Label>
                <Select value={howDidYouKnow} onValueChange={setHowDidYouKnow}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione uma opção' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='redes-sociais'>Redes sociais</SelectItem>
                    <SelectItem value='indicacao-amigo'>Indicação de amigo</SelectItem>
                    <SelectItem value='busca-google'>Busca no Google</SelectItem>
                    <SelectItem value='facebook'>Facebook</SelectItem>
                    <SelectItem value='instagram'>Instagram</SelectItem>
                    <SelectItem value='outros'>Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='password'>Senha *</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Digite sua senha'
                  required
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='terms'
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  />
                  <Label htmlFor='terms' className='text-sm'>
                    Aceito os <a href='/termos' className='text-primary underline'>Termos de uso</a>
                  </Label>
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='privacy'
                    checked={acceptPrivacy}
                    onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
                  />
                  <Label htmlFor='privacy' className='text-sm'>
                    Aceito a <a href='/privacidade' className='text-primary underline'>Política de privacidade</a>
                  </Label>
                </div>
              </div>

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className='space-y-4'>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Digite seu email'
                  required
                />
              </div>

              <div>
                <Label htmlFor='password'>Senha</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Digite sua senha'
                  required
                />
              </div>

              <div className='text-right'>
                <Button
                  variant='link'
                  type='button'
                  onClick={() => {
                    setShowResetPassword(true);
                    setError(null);
                    setResetEmail(email);
                  }}
                  className='text-sm p-0 h-auto'
                >
                  Esqueceu a senha?
                </Button>
              </div>

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          )}

          <div className='text-center'>
            <Button
              variant='link'
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setShowResetPassword(false);
              }}
              className='text-sm'
            >
              {isSignUp ? 'Já tem uma conta? Entre' : 'Não tem conta? Cadastre-se'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

export default AuthModal;