# 🔧 Referência Técnica - Arquitetura do Sistema

Para desenvolvedores e para futuras manutenções.

---

## 📁 Estrutura de Arquivos Modificados

### Core - Serviços
```
src/services/appointmentsService.ts
├── Interfaces: Service, Barber, AppointmentData
├── Funções Barbeiros: getBarbers(), addBarber(), updateBarber(), deleteBarber()
├── Funções Serviços: getServices(), addService(), updateService(), deleteService()
├── Funções Agendamentos: getAppointments(), addAppointment(), cancelAppointment()
└── Função Chave: getReservedSlotsByBarber(barberId, date) ← Filtra por barbeiro
```

### Páginas Principais
```
src/pages/AdminPage.tsx
├── Access Control: ADMIN_ACCESS_KEY, URL params, localStorage session (24h)
├── Estado: services[], barbers[], appointments[], forms state
├── Tabs: "Agendamentos", "Configurações"
│   └── Configurações tem: Serviços tab, Barbeiros tab
└── Funções de CRUD: handleSaveService/Barber, handleDeleteService/Barber, etc

src/pages/ClientAppointmentPage.tsx
├── 5 Steps: step state (1-5)
├── Estados: selectedBarber, selectedServices[], selectedDate, selectedTime
├── Step 1: Barbier selection grid
├── Step 2: multi-select services com preço/tempo
├── Step 3: date picker
├── Step 4: TimeSlotSelector com barbier-specific slots
└── Step 5: form dados + confirmation summary

src/pages/ChooseTypePage.tsx ← REMOVIDO, não existe mais
src/pages/OwnerLoginPage.tsx ← REMOVIDO, não existe mais
```

### Componentes
```
src/components/AppointmentsList.tsx
├── Carrega barbers Map<barberId, barberName>
├── Mostra appointments com barbeiro destacado
└── Função cancelAppointment() integrada

src/components/TimeSlotSelector.tsx
├── Props: selectedDate, selectedTime, onTimeSelect, reservedSlots? (optional)
├── Backward compatible: carrega reservedSlots do Firestore se não passar
└── Filtra horários ocupados vs livres

src/components/Navbar.tsx ← SIMPLIFICADO
├── Remove: AuthModal, login buttons
├── Mantém: "Agendar" button → /cliente

src/components/AuthModal.tsx ← SIMPLIFICADO
├── Remove: signup flow
├── Mantém: login (Google + email/password)

src/components/HeroSection.tsx
├── Bot "Agendar Horário" aponta para /cliente (antes era /escolher-tipo)
```

### Componentes UI (touchados minimamente)
```
src/components/ui/tabs.tsx - usado no AdminPage
src/components/ui/form.tsx - usado em forms
src/components/ui/button.tsx - usado em toda parte
```

---

## 🔐 Controle de Acesso

### Arquivo: `src/pages/AdminPage.tsx`

**Encontre esta linha:**
```typescript
const ADMIN_ACCESS_KEY = "admin2024";
```

**Para mudar a chave:**
1. Altere `"admin2024"` para sua chave desejada
2. Deploy
3. Acesse com: `/admin?key=sua_nova_chave`

**Como funciona:**
1. URL recebe: `/admin?key=admin2024`
2. localStorage recebe: `adminSession: { key: hash, expiresAt: timestamp }`
3. Sessão dura 24 horas
4. Sem chave na URL após entrar (segurança)

---

## 🔥 Firestore Collections

### Collection: `barbers`
```javascript
{
  id: "auto-gerado",
  name: "João Silva"
}
```

### Collection: `services`
```javascript
{
  id: "auto-gerado",
  name: "Corte Masculino",
  price: 50.00,
  estimatedTime: 45
}
```

### Collection: `agendamentos`
```javascript
{
  id: "auto-gerado",
  barberId: "ID do barbeiro",           // ← NOVO!
  services: ["serviceId1", ...],
  date: "2026-04-12",
  time: "15:00",
  clientName: "Maria Silva",
  clientPhone: "11999999999",
  clientEmail: "maria@email.com",
  clientCPF: "123.456.789-00" (opcional),
  observations: "..." (opcional),
  createdAt: timestamp
}
```

### Security Rules (Exemplo)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read (anyone can list services/barbers)
    match /servicos/{document=**} {
      allow read: if true;
    }
    match /barbeiros/{document=**} {
      allow read: if true;
    }
    
    // Protected write (admin only via custom logic)
    match /servicos/{document=**} {
      allow write: if true; // Na prática, controlar via app
    }
    match /barbeiros/{document=**} {
      allow write: if true; // Na prática, controlar via app
    }
    
    // Appointments: public write (clients), read protected
    match /agendamentos/{document=**} {
      allow create: if true;
      allow read: if true; // Na prática, filtrar no app
    }
  }
}
```

---

## 🔄 Fluxo de Dados

### Admin Adicionando Serviço

```
AdminPage.tsx (form input)
        ↓
handleSaveService()
        ↓
appointmentsService.addService({name, price, estimatedTime})
        ↓
Firebase Firestore: servicos collection
        ↓
⚡ Real-time sync: AppointmentsList e ClientAppointmentPage recarregam
```

### Cliente Fazendo Agendamento

```
ClientAppointmentPage.tsx (5-step form)
        ↓
Step 1: selectedBarber = "barberId123"
Step 2: selectedServices = ["svc1", "svc2"]
Step 3: selectedDate = "2026-04-12"
Step 4: selectedTime = "15:00"
        ↓ (Usa getReservedSlotsByBarber para filtrar)
Step 5: clientName, clientPhone, etc
        ↓
handleConfirm() → appointmentsService.addAppointment()
        ↓
Firebase Firestore: agendamentos collection
        ↓
⚡ Real-time sync: AdminPage AppointmentsList recarrega
```

### Sistema Calculando Horários Livres

```
ClientAppointmentPage Step 4
        ↓
Usa: getReservedSlotsByBarber(selectedBarber, selectedDate)
        ↓
Firestore query: WHERE barberId == "123" AND date == "2026-04-12"
        ↓
Retorna: ["09:00", "10:00", "14:00"] (ocupados)
        ↓
TimeSlotSelector filtra: mostra horas LIVRES
        ↓
Cliente clica horário livre → onTimeSelect()
```

---

## 🛠️ Como Editar/Estender

### Adicionar Novo Campo em Barbeiro

**Exemplo: Adicionar "especialidade"**

1. **Database:**
   ```typescript
   // appointmentsService.ts
   export interface Barber {
     id: string;
     name: string;
     specialization?: string;  // ← Novo
   }
   ```

2. **Admin Form:**
   ```typescript
   // AdminPage.tsx - adicione input
   <input
     type="text"
     placeholder="Especialidade (ex: Design de Sobrancelha)"
     value={editingBarber?.specialization || ''}
     onChange={(e) => setEditingBarber({...editingBarber, specialization: e.target.value})}
   />
   ```

3. **Client Display:**
   ```typescript
   // ClientAppointmentPage.tsx - mostre na Step 1
   <p>{barber.name}</p>
   {barber.specialization && <small>{barber.specialization}</small>}
   ```

### Adicionar Novo Campo em Serviço

**Exemplo: Adicionar "descrição"**

1. **Database:**
   ```typescript
   export interface Service {
     id: string;
     name: string;
     price: number;
     estimatedTime: number;
     description?: string;  // ← Novo
   }
   ```

2. **Admin Form:** (similar ao barber)

3. **Client Display:**
   ```typescript
   // ClientAppointmentPage.tsx Step 2
   <label>
     <input type="checkbox" ... />
     {service.name}
     {service.description && <p>{service.description}</p>}
   </label>
   ```

### Adicionar Novo Campo em Agendamento

**Exemplo: Adicionar "preferência de horário"**

1. **Database:**
   ```typescript
   export interface AppointmentData {
     // ...campos existentes...
     morningPreference?: boolean;  // ← Novo
   }
   ```

2. **Admin Form ou Client Form:** Adicione checkbox

3. **Visualizar:** AdminPage AppointmentsList mostra campo

---

## 🚀 Deploy Checklist

Antes de fazer deploy:

- [ ] Testar barbeiros CRUD
- [ ] Testar serviços CRUD
- [ ] Testar agendamento 5-step
- [ ] Testar barbier-specific slots
- [ ] Testar admin access key funciona
- [ ] Testar timeout de 24h (ou esperar)
- [ ] Firestore rules permitem read/write necessário
- [ ] ADMIN_ACCESS_KEY foi mudado de "admin2024"?
- [ ] Variáveis de ambiente estão corretas?

---

## 🐛 Debug

### Console Errors
```bash
F12 → Console → procure por erros red
```

### Firestore Não Sincronizando
```javascript
// No console do navegador
import { getFirestore, collection, getDocs } from "firebase/firestore";
const db = getFirestore();
getDocs(collection(db, "barbeiros")).then(snap => {
  snap.docs.forEach(doc => console.log(doc.data()));
});
```

### Ver LocalStorage Session
```javascript
// No console
console.log(localStorage.getItem('adminSession'));
```

### Ver Selected Slots
```javascript
// Adicione em ClientAppointmentPage Step 4
console.log("Barber:", selectedBarber);
console.log("Date:", selectedDate);
appointmentsService.getReservedSlotsByBarber(selectedBarber, selectedDate)
  .then(slots => console.log("Reserved:", slots));
```

---

## 📚 Imports Principais

### appointmentsService.ts exports
```typescript
export interface Service { ... }
export interface Barber { ... }
export interface AppointmentData { ... }

export const getServices: () => Promise<Service[]>
export const addService: (service: Omit<Service, 'id'>) => Promise<string>
export const updateService: (id: string, service: Partial<Service>) => Promise<void>
export const deleteService: (id: string) => Promise<void>

export const getBarbers: () => Promise<Barber[]>
export const addBarber: (barber: Omit<Barber, 'id'>) => Promise<string>
export const updateBarber: (id: string, barber: Partial<Barber>) => Promise<void>
export const deleteBarber: (id: string) => Promise<void>

export const getAppointments: () => Promise<AppointmentData[]>
export const addAppointment: (appointment: AppointmentData) => Promise<string>
export const cancelAppointment: (id: string) => Promise<void>
export const getReservedSlotsByBarber: (barberId: string, date: string) => Promise<string[]>
```

---

## 🔗 URLs do Sistema

| Página | URL | Acesso |
|--------|-----|--------|
| Página Inicial | `/` | Público |
| Agendamento Cliente | `/cliente` | Público |
| Painel Admin | `/admin?key=admin2024` | Padrão (mude a chave!) |
| Não Encontrado | `/404` | Qualquer rota inválida |

**Removidas:**
- ~~`/escolher-tipo`~~ (era página de seleção cliente/admin)
- ~~`/proprietario`~~ (era login proprietário)
- ~~`/confirmacao`~~ (agora step 5 do cliente)

---

## 💾 Backup de Dados

### Exportar Firestore
1. Firebase Console → Firestore
2. Abra cada collection
3. Botão "exportar" (se disponível)
4. Salve como JSON/CSV

### Backup Manual
```typescript
// No console do navegador, em qualquer página
import { getFirestore, collection, getDocs } from "firebase/firestore";
(async () => {
  const db = getFirestore();
  const barbers = await getDocs(collection(db, "barbers"));
  const services = await getDocs(collection(db, "services"));
  const appointments = await getDocs(collection(db, "appointments"));
  
  const backup = {
    barbers: barbers.docs.map(d => ({id: d.id, ...d.data()})),
    services: services.docs.map(d => ({id: d.id, ...d.data()})),
    appointments: appointments.docs.map(d => ({id: d.id, ...d.data()}))
  };
  
  console.log(JSON.stringify(backup, null, 2));
  // Copie e salve em arquivo .json
})();
```

---

## 🔮 Ideias Futuras

### Fácil de Implementar
- [ ] Horários específicos por barbeiro (trabalha 9-12, 14-18)
- [ ] Dias de folga por barbeiro
- [ ] Serviços específicos por barbeiro
- [ ] Preços diferentes por barbeiro
- [ ] Notificações SMS/Email para clientes

### Médio de Implementar
- [ ] Dashboard com gráficos (faturamento, agendamentos/dia)
- [ ] Sistema de avaliações
- [ ] Histórico de clientes repetiços
- [ ] Desconto/cupons

### Complexo de Implementar
- [ ] App mobile
- [ ] Sistema de pagamento integrado
- [ ] Integração WhatsApp
- [ ] Sincronização com Google Calendar

---

## 📞 Suporte Técnico

Se algo quebrar:

1. **Verifique erros no console** (F12)
2. **Verifique Firestore** está online
3. **Verifique localStorage** não está corrompido (`localStorage.clear()` se dúvida)
4. **Teste em navegador diferente/incógnito**
5. **Limpe cache** (Ctrl+Shift+Delete)

Se persistir:
- Printe o erro exato
- Revise as instruções aqui
- Considere resetar o Firebase projeto

---

## ✅ Resumo Rápido

| Aspecto | Localização | Como Editar |
|---------|------------|------------|
| Chave Admin | `src/pages/AdminPage.tsx` | Procure `ADMIN_ACCESS_KEY` |
| Barbeiros | Firestore collection `barbers` | Via AdminPage UI |
| Serviços | Firestore collection `services` | Via AdminPage UI |
| Agendamentos | Firestore collection `agendamentos` | Via AdminPage UI ou cliente |
| Fluxo Cliente | `src/pages/ClientAppointmentPage.tsx` | Edite o componente directamente |
| Horários | `src/components/TimeSlotSelector.tsx` | Edite lógica de geração |

Boa sorte! 🚀
