# ❓ FAQ - Perguntas e Respostas Frequentes

## 🔒 ACESSO ADMIN

### P: Como acesso o painel admin?
**R:** Use a URL com a chave de acesso:
```
http://localhost:5173/admin?key=admin2024
```
Após entrar, a chave é removida da URL e a sessão é mantida por 24 horas.

### P: O que fazer se perder acesso admin?
**R:** Simplesmente acesse novamente com a chave. Se não lembrar a chave:
1. Abra o arquivo `src/pages/AdminPage.tsx`
2. Procure por `const ADMIN_ACCESS_KEY = "admin2024"`
3. Retire a chave de lá

### P: Como mudo a chave de acesso?
**R:** 
1. Abra `src/pages/AdminPage.tsx`
2. Procure por: `const ADMIN_ACCESS_KEY = "admin2024"`
3. Altere para o que você quiser: `const ADMIN_ACCESS_KEY = "suanova2024"`
4. Agora acesse com: `/admin?key=suanova2024`

Recomendamos mover isso para um arquivo `.env` depois.

### P: Por quanto tempo fico logado?
**R:** 24 horas. Depois disso, precisa acessar novamente com a chave.

---

## 👨 GERENCIAR BARBEIROS

### P: Como adiciono um novo barbeiro?
**R:**
1. Entre no painel (`/admin?key=admin2024`)
2. Clique em "Configurações"
3. Aba "Barbeiros"
4. Clique em "Novo Barbeiro"
5. Digite o nome
6. Clique em "Salvar"

### P: Como removo um barbeiro?
**R:**
1. Na aba "Barbeiros", encontre o barbeiro
2. Clique no botão "🗑️ Deletar"
3. Confirme a exclusão

⚠️ **Cuidado:** Agendamentos antigos daquele barbeiro não são deletados!

### P: Como renomear um barbeiro?
**R:**
1. Na aba "Barbeiros", encontre o barbeiro
2. Clique em "✏️ Editar"
3. Altere o nome
4. Clique em "Salvar"

### P: Posso ter barbeiros que trabalham só determinados dias?
**R:** Não ainda. Sistema atual assume que todos trabalham todos os dias. 

**Alternativa:** Se um barbeiro trabalha só certas horas:
1. Ele pode não ter agendamentos nesses horários (natural)
2. Clientes vão ver horários livres dele

---

## 🔪 GERENCIAR SERVIÇOS

### P: Como crio um novo serviço?
**R:**
1. Entre no painel (`/admin?key=admin2024`)
2. Clique em "Configurações"
3. Aba "Serviços"
4. Clique em "Novo Serviço"
5. Preencha:
   - **Nome**: Ex "Corte Masculino"
   - **Preço**: Ex "50.00"
   - **Tempo**: Ex "45" (em minutos)
6. Clique em "Salvar"

### P: Como edito preço e tempo de um serviço?
**R:**
1. Na aba "Serviços", encontre o serviço
2. Clique em "✏️ Editar"
3. Altere qualquer campo
4. Clique em "Salvar"

✅ Clientes que fazem novos agendamentos já veem o novo preço!

### P: Como deleto um serviço?
**R:**
1. Na aba "Serviços", encontre o serviço
2. Clique em "🗑️ Deletar"
3. Confirme

⚠️ **Cuidado:** Removido da lista! Agendamentos antigos com esse serviço continuam no histórico.

### P: Posso ter preços diferentes por barbeiro?
**R:** Não ainda. O preço é global para todos os barbeiros.

**Alternativa:** Crie serviços diferentes:
- "Corte Masculino - João" - R$ 50
- "Corte Masculino - Pedro" - R$ 45
(Menos prático, mas funciona)

---

## 📅 AGENDAMENTOS DO CLIENTE

### P: Por que o cliente tem que escolher barbeiro PRIMEIRO?
**R:** Para que o sistema mostre os horários **daquele barbeiro específico**.
- João pode estar livre às 15:00
- Pedro pode estar ocupado às 15:00
- Sistema só mostra o que cada um tem disponível

### P: O cliente pode escolher múltiplos serviços?
**R:** **SIM!** Pode escolher vários:
- Corte + Barba
- Corte + Hidratação + Sobrancelha
- O sistema calcula o preço total automaticamente

### P: O tempo estimado bloqueia o agendamento?
**R:** **NÃO.** É apenas consultivo (informativo).
- Cliente agenda "Corte + Barba = 75 min"
- Mas pode ser mais rápido ou mais lento
- Sistema **não bloqueia** horários por tempo

### P: Como o sistema evita double-booking?
**R:** Cada barbeiro tem sua própria agenda:
- João às 15:00 na segunda = OCUPADO
- João não pode ter 2 clientes às 15:00
- Mas Pedro PODE ter cliente às 15:00 de João

### P: Cliente pode agendar com CPF diferente?
**R:** Não tem validação. Cada agendamento é independente:
- Cliente A: Maria Silva - CPF: 123
- Cliente B: Maria Silva - CPF: 456
- São registros diferentes

---

## 📋 VISUALIZAR AGENDAMENTOS

### P: Como vejo os agendamentos no painel?
**R:**
1. Entre no painel (`/admin?key=admin2024`)
2. Clique em "Agendamentos"
3. Vê lista com todos agendamentos

Cada agendamento mostra:
- Nome e dados do cliente
- **👨 Qual barbeiro escolheu** ← NOVO!
- Serviços e tempo
- Data e hora
- Opção de cancelar

### P: Como cancelo um agendamento?
**R:**
1. Na lista de agendamentos
2. Encontre o agendamento
3. Clique em "Cancelar"
4. Horário fica livre novamente ✅

### P: Posso filtrar agendamentos por data?
**R:** **SIM!** Use o filtro no topo da lista.

### P: Posso filtrar agendamentos por barbeiro?
**R:** Não há filtro específico, mas você vê o barbeiro destacado em cada agendamento.

---

## 🔧 TÉCNICO

### P: Onde são salvos os dados?
**R:** No **Firestore** (banco de dados Google):
- Collections: `barbeiros`, `servicos`, `agendamentos`
- Dados duplicados em nenhum lugar
- Sincroniza em tempo real

### P: Meu barbeiro pode fazer backup dos agendamentos?
**R:** **SIM.** Você pode exportar do Firestore console Google.

### P: Preciso fazer backup manual?
**R:** Firebase faz backup automático. Mas é bom caso você queira segurança extra.

### P: Como mudo a senha do admin?
**R:** Chave != Senha. Não tem "mudar" automático:
1. Edite `src/pages/AdminPage.tsx`
2. Altere `const ADMIN_ACCESS_KEY = "novo_codigo"`
3. Deploy

### P: Posso remover a necessidade de chave?
**R:** Você pode editar o código para remover a verificação, mas não é recomendado (qualquer um entraria).

---

## 🎨 COMO FUNCIONA A UI

### P: Por que os horários desaparecem após escolher?
**R:** É o fluxo esperado:
1. Escolhe barbeiro → confirma
2. Escolhe serviço → confirma
3. Escolhe data → confirma
4. **Agora sim** mostra os horários daquele barbeiro naquela data
5. Escolhe horário → confirma

### P: Preciso confirmar cada step?
**R:** Parcialmente. Você avança para próximo passo:
- Clica no barbeiro → vai para step 2 (serviço)
- Seleciona serviço → clica "Próximo" → vai para step 3 (data)
- E assim por diante

### P: Posso voltar para editar?
**R:** **SIM!** Tem botão "Voltar" em cada passo.
Vai para o anterior e pode mudar.

---

## ⚠️ PROBLEMAS COMUNS

### P: Cliente não vê horários ao agendar
**R:** Checklist:
- [ ] Escolheu barbeiro? (step 1)
- [ ] Escolheu pelo menos 1 serviço? (step 2)
- [ ] Escolheu data? (step 3)
- [ ] Clicou "Próximo" antes do passo 4?

É só depois de tudo que horários aparecem!

### P: Agendamento não salva
**R:** Checklist:
- [ ] Preencheu nome, telefone, email?
- [ ] Firestore está online?
- [ ] Vê erro no console (F12)?
- [ ] Sessão admin expirou? (refaça login)

### P: Horários aparecem bloqueados sem motivo
**R:** Checklist:
- [ ] Tem agendamento naquele horário com esse barbeiro?
- [ ] Abra F12 → Console → vê algum erro?
- [ ] O barbeiro realmente foi selecionado?

### P: Barbeiro desaparece da lista
**R:** Checklist:
- [ ] Você deletou ele? (não pode recuperar fácil)
- [ ] Atualizou a página?
- [ ] Attendees filter está ativo?

### P: Serviço não aparece
**R:** Checklist:
- [ ] Você criou o serviço?
- [ ] Atualizou a página?
- [ ] Tem preço? (preço 0 ≠ grátis, cria confusão)

---

## 💡 BOAS PRÁTICAS

### P: Qual nome bom para barbeiro?
**R:** Simples e claro:
- ✅ "João Silva"
- ✅ "Pedro"
- ✅ "Aprendiz Carlos"
- ❌ "Barbeiro #1" (confuso)
- ❌ "João da Silva Sousa Costa" (muito longo)

### P: Qual nome bom para serviço?
**R:** Descreva o serviço:
- ✅ "Corte Masculino"
- ✅ "Barba com Navalha"
- ✅ "Design de Sobrancelha"
- ❌ "X" (muito vago)
- ❌ "Serviço 1" (robótico)

### P: Como escolho bom preço?
**R:** Depende da região:
- Metrópoles: R$ 40-80 corte
- Interior: R$ 20-50 corte
- Clientes voltam se preço justo

### P: Qual tempo estimado?
**R:** Média real da sua barbearia:
- Corte rápido: 30 min
- Corte completo: 45 min
- Corte + Barba: 60 min
- Serviços especiais: 45-60 min

---

## 📞 NÃO ENCONTROU A RESPOSTA?

Se a sua dúvida não está aqui:

1. Verifique `NOVO_SISTEMA_AGENDAMENTO.md` para tutorial completo
2. Verifique `GUIA_RAPIDO_TESTE.md` para passo a passo
3. Verifique o console do navegador (F12) para erros técnicos

Boa sorte! 🎉
