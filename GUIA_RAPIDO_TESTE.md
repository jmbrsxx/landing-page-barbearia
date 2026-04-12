# ⚡ Guia Rápido - Testando Zero a Um

Siga estes passos para testar o novo sistema funcionando **completamente**.

## 🔴 Passo 1: Acessar o Painel Admin

```
URL: http://localhost:5173/admin?key=admin2024
```

✅ Você entra no painel (a chave sai da URL para não aparecer no histórico)

---

## 🟡 Passo 2: Criar Barbeiros

No painel, clique em **"Configurações"** → Aba **"Barbeiros"**

### Crie 2-3 barbeiros:
1. Clique em **"Novo Barbeiro"**
2. Digite nome: `João Silva`
3. Clique em **"Salvar"**

Repita para:
- `Pedro Costa`
- `Carlos Dias`

Você verá a lista com os 3 barbeiros criados.

---

## 🟠 Passo 3: Criar Serviços

No painel, clique em **"Configurações"** → Aba **"Serviços"**

### Crie 3-4 serviços:

**Serviço 1:**
- Nome: `Corte Masculino`
- Preço: `50`
- Tempo: `45`
- Clique em **"Salvar"**

**Serviço 2:**
- Nome: `Barba Completa`
- Preço: `35`
- Tempo: `30`
- Clique em **"Salvar"**

**Serviço 3:**
- Nome: `Corte + Barba`
- Preço: `75`
- Tempo: `75`
- Clique em **"Salvar"**

Você verá a lista com os 3 serviços criados.

---

## 🟢 Passo 4: Cliente Faz Agendamento

Abra nova aba:
```
URL: http://localhost:5173/cliente
```

### Acompanhe os passos:

**PASSO 1 - Escolher Barbeiro:**
- Vê 3 botões: João Silva, Pedro Costa, Carlos Dias
- Clica em um (ex: `João Silva`)
- Botão fica destacado (verde ou azul)

**PASSO 2 - Escolher Serviço(s):**
- Vê checkboxes com serviços que criou
- Cada um mostra: nome, preço, tempo
- Total é calculado automaticamente
- Marca um ou mais (ex: marca `Corte + Barba`)

**PASSO 3 - Escolher Data:**
- Abre calendário
- Seleciona uma data (ex: próxima segunda-feira)

**PASSO 4 - Escolher Horário:**
⭐ **Aqui é a mágica:**
- Mostra os horários livres **do João Silva** naquele dia
- Se João já tiver agendamentos, esses horários não aparecem
- Seleciona um horário (ex: `15:00`)

**PASSO 5 - Preencher Dados:**
- Nome: `Maria Silva`
- Telefone: `11999999999`
- Email: `maria@email.com`
- CPF: (opcional)
- Observações: (opcional)
- Clica em **"Confirmar Agendamento"**

✅ Agendamento confirmado!

---

## 🔵 Passo 5: Ver o Agendamento

De volta no painel admin:
```
URL: http://localhost:5173/admin?key=admin2024
```

Clique em **"Agendamentos"**

Você verá:
```
📋 AGENDAMENTOS

Maria Silva
👨 João Silva ← NOVO! Mostra qual barbeiro
⏱️ Corte + Barba (75 min)
📅 Seg, 12/04/2026
🕒 15:00
📞 11999999999
✉️ maria@email.com
```

---

## 🎯 Teste Avançado (Opcional)

### Teste Conflito de Horários

1. **Agendamento 1:** João Silva - 15:00 na segunda
   - Cliente 1 faz agendamento → OK

2. **Agendamento 2:** João Silva - 15:00 na segunda
   - Cliente 2 tenta por - **Horário deve estar bloqueado** ✅

3. **Agendamento 3:** Pedro Costa - 15:00 na segunda
   - Cliente 3 faz agendamento - **Deve funcionar!** ✅
   - (Porque é outro barbeiro)

---

## 🧪 Checklist de Testes

- [ ] Login admin com `?key=admin2024` funciona
- [ ] Criou 3 barbeiros com sucesso
- [ ] Criou 3 serviços com sucesso
- [ ] Cliente vê os 3 barbeiros na seleção
- [ ] Cliente vê os 3 serviços na seleção
- [ ] Total de preço calcula corretamente
- [ ] Calendário abre e deixa escolher data
- [ ] Horários aparecem na seleção de tempo
- [ ] Agendamento é confirmado
- [ ] Agendamento aparece no painel com o barbeiro
- [ ] Barbeiro aparece destacado no agendamento

---

## ⚠️ Se Algo Não Funcionar

### Erro ao criar barbeiro?
- Verifique se Firebase está rodando: `npm run dev`
- Verifique conexão com Firestore

### Horários não aparecem?
- Cliente precisa selecionar: **Barbeiro** → **Serviço** → **Data** (nessa ordem)
- O horário só aparece na step 4

### Cliente não vê o barbeiro selecionado?
- Verifique se cliclou direto no barbeiro (não no fundo)
- Ele deve ficar highlighted

### Agendamento não salva?
- Verifique console (F12) para erros
- Verifique se Firestore permet escrever em `appointments`

---

## 🚀 Próximas Etapas

Após testar e confirmar que está funcionando:

1. **Teste com diferentes barbeiros**
   - Faça 3 agendamentos com barbeiros diferentes
   - Horários podem ser iguais (cada um tem sua agenda)

2. **Teste múltiplos serviços**
   - Selecione 2+ serviços
   - Veja o total e tempo calcularem

3. **Teste edição**
   - Altere preço de um serviço
   - Cliente vê o novo preço imediatamente

4. **Teste deleção**
   - Delete um barbeiro
   - Abra novo agendamento cliente - barbeiro some da lista ✅

---

## 📝 Notas

- Sistema usa `localStorage` para manter sessão admin (24 horas)
- Barbeiros e serviços são **persistentes** no Firestore
- Agendamentos são **permanentes** no Firestore
- Pode fazer infinitos testes sem quebrar nada

Sucesso no teste! 🎉
