# 📋 Guia do Novo Sistema de Agendamento e Gerenciamento

## ✅ O que foi implementado

### 1. **Configurações da Barbearia (Admin)**
No painel admin, você agora pode:

#### 🔧 Gerenciar Serviços
- **Adicionar** novo serviço com: nome, preço e tempo estimado
- **Editar** serviços existentes
- **Deletar** serviços que não oferece mais

Exemplo:
```
✏️ Corte Masculino - R$ 50 - 45 minutos
✏️ Barba Completa - R$ 35 - 30 minutos
✏️ Corte + Barba - R$ 75 - 75 minutos
```

#### 👨 Gerenciar Barbeiros
- **Adicionar** novo barbeiro
- **Editar** nome do barbeiro
- **Deletar** barbeiro

Exemplo:
```
João Silva ✏️ 🗑️
Pedro Costa ✏️ 🗑️
```

### 2. **Agendamento do Cliente (Novo Fluxo)**
Agora o cliente segue estes passos:

**Passo 1️⃣ - Escolher Barbeiro**
- Clica em um barbeiro disponível
- Visual ao selecionar

**Passo 2️⃣ - Escolher Serviço(s)**
- Seleciona um ou mais serviços
- Vê o preço e tempo estimado de cada um
- Sistema calcula total automático

**Passo 3️⃣ - Escolher Data**
- Abre calendário
- Seleciona a data desejada

**Passo 4️⃣ - Escolher Horário**
- Sistema mostra horários disponíveis **daquele barbeiro específico**
- Horários já ocupados por aquele barbeiro não aparecem
- Seleciona o horário

**Passo 5️⃣ - Preencher Dados**
- Nome, telefone, email (obrigatórios)
- CPF e observações (opcionais)
- Sistema mostra resumo completo do agendamento
- Confirma agendamento

### 3. **Visualizar Agendamentos (Admin)**
Na lista de agendamentos agora mostra:
- ✅ **Nome do Barbeiro** - Qual barbeiro o cliente escolheu
- ✅ Serviços com tempo estimado
- ✅ Data e hora específicas
- ✅ Dados do cliente (nome, telefone, email, CPF)

---

## 🚀 Como Usar

### Acessar o Painel Admin
1. Acesse: `http://seu-site.com/admin?key=admin2024`
2. Você será redirecionado para: `/admin` (chave removida da URL)

### Adicionar Barbeiro
1. Clique em "Configurações"
2. Abra a aba "Barbeiros"
3. Clique em "Novo Barbeiro"
4. Digite o nome e clique em "Salvar"

### Adicionar Serviço
1. Clique em "Configurações"
2. Abra a aba "Serviços"
3. Clique em "Novo Serviço"
4. Preencha:
   - **Nome**: Ex "Corte Masculino"
   - **Preço**: Ex "50"
   - **Tempo**: Ex "45" (em minutos)
5. Clique em "Salvar"

### Editar Serviço/Barbeiro
1. Encontre o item na lista
2. Clique em "Editar"
3. Siga o formulário para alterar
4. Clique em "Salvar"

### Deletar Serviço/Barbeiro
1. Encontre o item na lista
2. Clique em "Deletar"
3. Confirme a exclusão

---

## ⏰ Como Funciona o Agendamento com Barbeiro Específico

### Para o Cliente
```
Cliente seleciona: João Silva
        ↓
Cliente seleciona: Corte + Barba (75 min)
        ↓
Cliente seleciona: 12/04/2026
        ↓
Sistema mostra: Horários de João Silva nesse dia
- João tem ocupado: 09:00, 10:00, 14:00
- João tem livre: 08:00, 11:00, 12:00, 13:00, 15:00, 16:00, 17:00
        ↓
Cliente escolhe: 15:00
        ↓
Agendamento confirmado com João às 15:00
```

### Para o Admin (Visualizar)
```
Nome: Maria Silva
Barbeiro: João Silva ← Novo!
Serviços: Corte + Barba (75 min)
Data: 12/04/2026
Hora: 15:00
```

---

## 🔑 Principais Mudanças Técnicas

### Campo Novo
- Agendamentos agora têm: `barberId` (qual barbeiro foi escolhido)

### Collections Firestore
- ✅ `services` - Armazena serviços editáveis
- ✅ `barbers` - Armazena barbeiros
- ✅ `appointments` - Agora com `barberId`

### Horários
- Horários são agora **por barbeiro**, não global
- Cada barbeiro pode ter horários diferentes ocupados
- O cliente vê apenas os horários livres de quem escolheu

---

## 📊 Exemplo Completo

### Sua Barbearia Tem:
- **Barbeiros**: João, Pedro, Carlos
- **Serviços**: 
  - Corte (R$50, 45min)
  - Barba (R$35, 30min)
  - Corte+Barba (R$75, 75min)

### Cliente Tem Opções
```
Segunda (12/04)
├── João Silva
│   ├── 08:00 - OK
│   ├── 09:00 - Ocupado
│   ├── 10:00 - OK
│   └── ... (via barbeiro)
├── Pedro Costa
│   ├── 08:00 - OK
│   ├── 09:00 - OK
│   └── ... (via barbeiro)
└── Carlos Dias
    ├── 08:00 - Ocupado
    └── ... (via barbeiro)
```

---

## 🔐 Segurança

- **Chave de acesso**: `admin2024` (altere em `src/pages/AdminPage.tsx`)
- **Barbeiros**: Qualquer um pode ver na seleção (público)
- **Serviços**: Carregados do Firestore (público)
- **Agendamentos**: Só visto no painel admin protegido

---

## 💡 Dicas

- Adicione pelo menos 1 barbeiro e 1 serviço antes de testar
- Teste agendando no seu próprio site
- Verifique se os horários aparecem corretamente por barbeiro
- Use tempos realistas (45min para corte, 30min para barba)

---

## ❓ Perguntas Frequentes

**P: Como mudo o preço de um serviço?**
R: Clique em "Editar" na lista de serviços e altere o valor.

**P: Como removo um barbeiro?**
R: Clique em "Deletar" no barbeiro que deseja remover.

**P: Os agendamentos antigos continuam funcionando?**
R: Sim, mas não terão `barberId` associado. Novos agendamentos sempre terão.

**P: Como mudo a chave de acesso do admin?**
R: Abra `src/pages/AdminPage.tsx`, procure por `const ADMIN_ACCESS_KEY = "admin2024"` e altere.

---

## 📝 Notas

- Sistema calcula automaticamente o total (preço × serviços)
- Tempo estimado é consultivo (não bloqueia agendamentos)
- Um barbeiro pode ter vários agendamentos diferentes no mesmo dia
- O sistema não permite dois clientes no mesmo barbeiro no mesmo horário
