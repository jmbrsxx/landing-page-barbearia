# Sistema de Agendamento de Barbearia

## ✨ Funcionalidades Implementadas

### 1. **Seletor de Horários Dinâmico**
- Exibe 10 horários disponíveis (08:00 às 18:00, com intervalo de 1 hora)
- Horários já reservados aparecem desabilitados/acinzentados
- Horário selecionado fica destacado em **verde**
- Contador mostra quantos horários estão disponíveis para a data selecionada

### 2. **Reserva de Agendamentos**
- Ao submeter o formulário, o agendamento é **salvo automaticamente** no navegador
- O horário fica indisponível para próximos clientes
- Dados salvos: nome, email, telefone, data, hora e serviços

### 3. **Página de Admin**
- Acesse: `/admin/agendamentos` (ou clique em "Painel de Agendamentos")
- **Visualize todos os agendamentos confirmados**
- **Filtre por data** para ver agendamentos específicos
- **Informações completas**: nome, contato, data/hora, serviços
- **Cancele agendamentos** se necessário

## 🚀 Como Funciona

### Para Clientes (Página de Agendamento)
1. Preencha seus dados (nome, telefone, email)
2. **Selecione uma data** - os horários aparecerão automaticamente
3. **Escolha um horário disponível** - clique em um horário verde
4. Selecione os serviços desejados
5. Adicione observações (opcional)
6. Clique em "Agendar Consulta" - será redirecionado para WhatsApp

### Para Gerentes (Painel Admin)
1. Acesse `/admin/agendamentos`
2. Visualize todos os agendamentos
3. Use o filtro de data para ver agendamentos específicos
4. Cancele agendamentos não mais válidos
5. Acompanhe o nome, phone, email e hora de cada cliente

## 💾 Armazenamento

Os dados são salvos em **localStorage** do navegador. Isso significa:
- ✅ Os dados persistem mesmo fechando a aba/navegador
- ⚠️ Os dados são específicos do navegador/dispositivo
- ⚠️ Cada navegador/dispositivo tem seus próprios dados

### Estrutura de Dados Salva
```json
{
  "id": 1234567890,
  "name": "João Silva",
  "phone": "11 99999-9999",
  "email": "joao@example.com",
  "date": "2024-04-15",
  "time": "10:00",
  "services": ["Corte Masculino", "Barba Completa"],
  "notes": "Prefiro fade",
  "status": "confirmed",
  "createdAt": "2024-04-07T10:30:00.000Z"
}
```

## 🔧 Personalizações Disponíveis

Edite o arquivo `TimeSlotSelector.tsx` para customizar:

```typescript
const BUSINESS_HOURS = {
  start: 8,      // Hora de início (8 = 08:00)
  end: 18,       // Hora de encerramento (18 = 18:00)
  interval: 60,  // Intervalo em minutos (60 = 1 hora, 30 = 30min)
};
```

## 📝 Próximos Passos Recomendados

1. **Backend Real**: Migrar dados para um servidor (Firebase, Supabase)
2. **Autenticação**: Proteger painel admin com senha
3. **Confirmação por Email/SMS**: Enviar confirmação ao cliente
4. **Múltiplos Profissionais**: Suportar agendas diferentes por barbeiro
5. **Horários de Descanso**: Adicionar intervalos de pausa
6. **Limites**: Permitir múltiplos clientes no mesmo horário (ex: 2 cadeiras)

## 🎯 Rutas Disponíveis

- `/` - Página inicial
- `/agendar` - Página de agendamento
- `/admin/agendamentos` - Painel de gerenciamento

---

**Status**: Sistema funcional e testado ✅
**Armazenamento**: localStorage (cliente)
**Data de Implementação**: 07/04/2026
