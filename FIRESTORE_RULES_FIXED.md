# Regras de Segurança do Firestore - Versão Atualizada

## Regras Corretas (Copy & Paste no Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita de agendamentos apenas para usuários autenticados
    match /appointments/{document=**} {
      // Usuários autenticados podem criar novos agendamentos
      allow create: if request.auth != null;

      // Usuários autenticados podem ler todos os agendamentos (para painel admin)
      allow read: if request.auth != null;

      // Usuários autenticados podem atualizar qualquer agendamento (para painel admin)
      allow update: if request.auth != null;

      // Usuários autenticados podem deletar qualquer agendamento (para painel admin)
      allow delete: if request.auth != null;
    }

    // Regras para perfis de usuário
    match /userProfiles/{document=**} {
      // Usuários autenticados podem ler todos os perfis (para painel admin)
      allow read: if request.auth != null;

      // Usuários podem escrever apenas seu próprio perfil
      allow write: if request.auth != null && request.auth.uid == resource.id;

      // Usuários podem criar seu próprio perfil
      allow create: if request.auth != null && request.auth.uid == request.resource.id;
    }
  }
}
```

## Como aplicar:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto `barbearia-52835`
3. Vá para **Firestore Database** → **Rules**
4. Delete tudo e cole as regras acima
5. Clique em **Publish**

Isso resolverá o erro "Missing or insufficient permissions" ao cancelar agendamentos no painel admin.