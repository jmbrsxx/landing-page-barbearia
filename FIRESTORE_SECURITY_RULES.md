# Firestore Security Rules

Para que os agendamentos sejam salvos corretamente, você precisa configurar as regras de segurança do Firestore.

## ⚠️ IMPORTANTE: Problema Atual

Você está vendo erros de "Missing or insufficient permissions" porque as regras de segurança do Firestore ainda não foram aplicadas ou estão muito restritivas. Isso é **obrigatório** para que o sistema funcione, especialmente para o painel admin poder cancelar agendamentos.

### Problema específico: Cancelamento de agendamentos
O erro "Missing or insufficient permissions" ao tentar cancelar agendamentos no painel admin indica que as regras atuais só permitem que usuários atualizem seus próprios agendamentos. Para o painel admin funcionar corretamente, qualquer usuário autenticado deve poder gerenciar todos os agendamentos.

### Solução rápida para cancelamento:
Se você já tem regras configuradas mas ainda vê o erro, atualize suas regras para permitir que usuários autenticados possam atualizar qualquer agendamento (como mostrado abaixo).

## Como configurar (Passo a passo):

### 1. Acesse o Firebase Console
- Abra: [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Selecione seu projeto `barbearia-52835`

### 2. Vá para Firestore Database
- Clique em **Firestore Database** no menu lateral
- Se ainda não criou o banco, clique em **Create database**
- Escolha **Start in test mode** (para desenvolvimento)
- Selecione uma localização (ex: `us-central1`)

### 3. Configure as Security Rules
- Clique na aba **Rules**
- **DELETE** todo o conteúdo atual
- **COPY & PASTE** as regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para agendamentos
    match /appointments/{document=**} {
      // Qualquer pessoa pode criar agendamentos (clientes não logados)
      allow create: if true;

      // Apenas usuários autenticados podem ler agendamentos (painel admin)
      allow read: if request.auth != null;

      // Apenas usuários autenticados podem atualizar agendamentos (painel admin)
      allow update: if request.auth != null;

      // Apenas usuários autenticados podem deletar agendamentos (painel admin)
      allow delete: if request.auth != null;
    }

    // Regras para barbeiros (NOVO - necessário para agendamento funcionar)
    match /barbers/{document=**} {
      // Qualquer pessoa pode ver barbeiros (clientes precisam escolher)
      allow read: if true;

      // Apenas usuários autenticados podem gerenciar barbeiros (admin)
      allow write: if request.auth != null;
    }

    // Regras para serviços (NOVO - necessário para agendamento funcionar)
    match /services/{document=**} {
      // Qualquer pessoa pode ver serviços (clientes precisam escolher)
      allow read: if true;

      // Apenas usuários autenticados podem gerenciar serviços (admin)
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Clique em **Publish**
- Aguarde a publicação das regras
- Agora o sistema deve funcionar sem erros de permissões

## 🔍 Verificando se funcionou

Após publicar as regras:

1. **Recarregue a página** do cliente (`/cliente`)
2. **Abra o console** (F12)
3. **Procure por erros** - não deve haver mais "Missing or insufficient permissions"
4. **Teste o agendamento** - deve aparecer barbeiros e serviços

## 🚨 Se ainda não funcionar

### Possível problema: Collection names
Verifique se as collections no Firestore têm exatamente estes nomes:
- `barbers` (não `barbeiros`)
- `services` (não `servicos`)
- `appointments` (não `agendamentos`)

### Possível problema: Autenticação
Certifique-se de que você está logado no Firebase Auth quando acessa o painel admin.

### Possível problema: Regras não publicadas
As regras só funcionam após clicar em **Publish**. Se você editou mas não publicou, elas não valem.

## 📝 Notas importantes

- **Leitura pública**: Barbeiros e serviços podem ser lidos por qualquer pessoa (necessário para clientes agendarem)
- **Escrita protegida**: Só usuários logados podem criar/editar/deletar barbeiros e serviços
- **Test mode**: Para desenvolvimento, você pode usar "test mode" que permite tudo por 30 dias
- **Produção**: Em produção, use regras mais restritivas baseadas em roles de usuário

## 🔧 Troubleshooting

### Erro: "Missing or insufficient permissions" continua
1. Verifique se publicou as regras
2. Recarregue a página completamente (Ctrl+F5)
3. Limpe cache do navegador
4. Tente em modo incógnito

### Erro: "Collection not found"
- As collections são criadas automaticamente quando você adiciona o primeiro documento
- Adicione um barbeiro e serviço via painel admin para criar as collections

### Erro: "Auth required" no painel admin
- Certifique-se de estar logado no Firebase Auth
- Acesse `/admin?key=admin2024` primeiro para fazer login

### 4. Publique as regras
- Clique no botão **Publish** (azul)
- Confirme clicando em **Publish** novamente
- Aguarde alguns segundos para as regras serem aplicadas

## Verificação

Após publicar as regras:

1. **Teste a autenticação** - Tente fazer login com Google
2. **Teste um agendamento** - Crie um novo agendamento
3. **Verifique o painel admin** - Deve carregar os agendamentos

## Se ainda não funcionar:

### Problema: Cross-Origin-Opener-Policy
Se você ver erros como "Cross-Origin-Opener-Policy policy would block the window.closed call", isso é normal em desenvolvimento local. Não afeta a funcionalidade.

### Problema: Ainda sem permissões
- Verifique se você está logado (botão "Sair" deve aparecer no menu)
- Abra o **Console do navegador** (F12) e veja se há erros específicos
- As regras podem levar até 10 minutos para serem aplicadas globalmente

### Para desenvolvimento local (opcional):
Se quiser testar sem regras restritivas, use temporariamente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ AVISO:** Nunca use essas regras permissivas em produção!

## Testando:

Após publicar as regras:

1. Tente criar um agendamento novamente
2. Abra o **Console** do navegador (F12)
3. Se houver erro de permissão, você verá no console
4. Se funcionar, o agendamento aparecerá no painel do admin

## Possíveis Erros:

Se ver erro como `Permission denied`, significa que as regras ainda não foram aplicadas. Aguarde 30 segundos e tente novamente.

## Índices Necessários (se solicitado):

Se o Firestore pedir para criar índices, clique em **Create Index** - isso garante performance nas queries.
