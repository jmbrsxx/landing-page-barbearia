# Regras de Segurança do Firestore - ATUALIZADAS

## ⚠️ IMPORTANTE: Regras Atualizadas para Suporte a Clientes Não Logados

As regras anteriores exigiam autenticação para criar agendamentos, mas agora clientes podem agendar sem login. Use as regras abaixo:

## Regras Corretas (Copy & Paste no Firebase Console):

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
  }
}
```

## Como aplicar:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto `barbearia-52835`
3. Vá para **Firestore Database** → **Rules**
4. **DELETE** todo o conteúdo atual
5. **COPY & PASTE** as regras acima
6. Clique em **Publish**

## O que mudou:
- `allow create: if true` - Agora qualquer pessoa pode criar agendamentos (clientes não precisam estar logados)
- Leituras, atualizações e deleções ainda exigem autenticação (apenas proprietários no painel admin)

Isso resolverá o erro "Missing or insufficient permissions" para agendamentos de clientes.