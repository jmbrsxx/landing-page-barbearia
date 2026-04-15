# Gerenciamento de Horários de Barbeiros

## 📋 Descrição

Esta funcionalidade permite que os proprietários ajustem e gerenciem os horários de disponibilidade de cada barbeiro no sistema de agendamento.

## 🎯 Como Acessar

1. Acesse o **Painel Administrativo** (`/admin`)
2. Digite a chave de acesso: `admin2024`
3. Clique na aba **"Configurações"**
4. Selecione a sub-aba **"Horários"**

## 🛠️ Funcionalidades

### Selecionar Barbeiro
- Use os botões no topo para selecionar qual barbeiro deseja configurar
- O horário será carregado automaticamente

### Configurar Dias de Trabalho
Para cada dia da semana, você pode:

**Ativar/Desativar o Dia:**
- Marque a checkbox para ativar o dia de trabalho
- Desmarque para marcar como folga

**Definir Horários:**
- **De:** Horário de início do expediente (ex: 08:00)
- **Até:** Horário de término do expediente (ex: 18:00)

### Horário Padrão
Se o barbeiro não tiver configuração personalizada, o sistema usa:
- **Segunda a Sexta:** 08:00 - 18:00
- **Sábado:** 08:00 - 17:00
- **Domingo:** Folga

## 💾 Salvando Alterações

**Salvar Horários:**
- Clique no botão "Salvar Horários" para confirmar as mudanças
- Uma mensagem de sucesso será exibida

**Resetar para Padrão:**
- Clique em "Resetar para Padrão" para voltar aos horários originais
- Você será pedido para confirmar

## 📊 Impacto no Sistema

Os horários configurados afetam:
- **Apresentação de horários disponíveis** ao cliente fazer agendamento
- **Bloqueio automático** de horários fora do expediente
- **Visualização no painel** de agendamentos do barbeiro

## 🔧 Detalhes Técnicos

### Estrutura de Dados
```javascript
{
  barberId: "id-do-barbeiro",
  weekSchedule: {
    monday: { isWorking: true, startTime: "08:00", endTime: "18:00" },
    tuesday: { isWorking: true, startTime: "08:00", endTime: "18:00" },
    // ... outros dias
  }
}
```

### Armazenamento
- Os horários são salvos no **Firestore** na collection `barberSchedules`
- Cada barbeiro tem um documento com seu ID
- As alterações são sincronizadas em tempo real

### Métodos do Serviço
```typescript
// Buscar horários de um barbeiro
appointmentsService.getBarberSchedule(barberId)

// Salvar horários
appointmentsService.saveBarberSchedule(schedule)

// Resetar para padrão
appointmentsService.resetBarberSchedule(barberId)

// Obter horário padrão
appointmentsService.getDefaultSchedule(barberId)
```

## ✅ Validações

- ✓ Todos os dias da semana podem ser configurados
- ✓ Horários no formato 24 horas (HH:MM)
- ✓ Confirmação ao resetar para evitar erros
- ✓ Feedback visual (mensagens de sucesso/erro)

## 🐛 Troubleshooting

**Problema:** Os horários não estão salvando
- Verifique a permissão de escrita no Firestore
- Verifique a conexão com o Firebase

**Problema:** Todos os barbeiros têm o mesmo horário
- Use a nova aba "Horários" para personalizar cada um
- Clique em "Resetar para Padrão" se necessário

**Problema:** Horários não aparecem na seleção de agendamento
- Verifique se o barbeiro está marcado como "trabalhando" no dia
- Confirme que a hora atual está dentro do horário configurado

## 📝 Exemplo de Uso

1. **João Silva** trabalha segunda a sexta (08:00-18:00) e sábado (08:00-17:00)
   - Desmarque "Domingo"
   - Configure segundo a série de dias

2. **Maria Santos** tem folga às quartas
   - Desmarque "Wednesday"
   - Deixe os outros dias marcados

3. **Pedro Oliveira** entra mais tarde nas quintas
   - Na quinta, mude a hora de início para 10:00

## 🔄 Atualizações Futuras

Possíveis melhorias:
- [ ] Configurar pausas/horários de almoço específicos
- [ ] Definir horários diferentes para tipos de serviço
- [ ] Variações por semana/período específico
- [ ] Importar horários em lote de um CSV
