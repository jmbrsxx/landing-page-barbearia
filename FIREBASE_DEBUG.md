# Verificação de Configuração Firebase

Execute este script para testar se sua configuração está funcionando:

## 1. Teste Básico (no Console do navegador)

Abra o console do navegador (F12) e execute:

```javascript
// Teste 1: Verificar se Firebase está inicializado
console.log('Firebase app:', window.firebase?.app?.name || 'Não inicializado');

// Teste 2: Verificar autenticação
import { auth } from './src/lib/firebase';
console.log('Auth user:', auth.currentUser);

// Teste 3: Teste simples de Firestore
import { db } from './src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    console.log('✅ Firestore funcionando! Documentos:', querySnapshot.size);
  } catch (error) {
    console.error('❌ Erro no Firestore:', error.message);
  }
}
testFirestore();
```

## 2. Verificações no Firebase Console

### Authentication:
- ✅ Google provider habilitado?
- ✅ Seu domínio está na lista de domínios autorizados?
- ✅ Para desenvolvimento: `localhost` está autorizado?

### Firestore:
- ✅ Database criado?
- ✅ Regras de segurança publicadas?
- ✅ Test mode ou regras customizadas?

### Project Settings:
- ✅ API key correta?
- ✅ Auth domain correto?
- ✅ Project ID correto?

## 3. Checklist de Solução

- [ ] Configurou as regras do Firestore (FIRESTORE_SECURITY_RULES.md)
- [ ] Aguardou 5-10 minutos após publicar as regras
- [ ] Testou o login com Google
- [ ] Verificou se está logado (botão "Sair" aparece)
- [ ] Testou criar um agendamento
- [ ] Verificou o painel admin

## 4. Se ainda não funcionar:

### Problema: "Missing or insufficient permissions"
- As regras do Firestore não foram aplicadas
- Solução: Vá ao Firebase Console → Firestore → Rules → Publish novamente

### Problema: "Auth domain not authorized"
- O domínio não está na lista de domínios autorizados
- Solução: Firebase Console → Authentication → Settings → Authorized domains

### Problema: Popup não abre
- COOP policy bloqueando
- Solução: Normal em desenvolvimento, funciona em produção

## 5. Logs de Debug

Para mais informações, adicione ao seu código:

```typescript
// Em appointmentsService.ts
async createAppointment(data: AppointmentData) {
  console.log('Tentando criar agendamento:', data);
  console.log('Usuário autenticado:', auth.currentUser);

  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('✅ Agendamento criado com sucesso:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro detalhado:', error);
    throw error;
  }
}
```