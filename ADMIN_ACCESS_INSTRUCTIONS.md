# Instruções de Acesso ao Painel Admin

## Nova Estrutura de Acesso

O painel administrativo foi alterado para aceitar acesso via **link especial com chave de segurança**.

### 🔐 Chave de Acesso Padrão
```
admin2024
```

### 📍 Link de Acesso
Para acessar o painel administrativo, abra o seguinte link no navegador:

```
http://seu-dominio.com/admin?key=admin2024
```

### ⚙️ Como Funciona

1. **Primeiro Acesso**: Acesse o link com a chave de segurança
2. **Verificação**: O sistema valida a chave
3. **Sessão**: Uma vez autenticado, você terá acesso por **24 horas**
4. **Armazenamento**: O acesso é armazenado no navegador (localStorage)
5. **Saída**: Clique em "Sair" para remover o acesso

### 🔄 Alterações Realizadas

✅ **Removidas** as opções de cadastro e login tradicional do cliente/proprietário  
✅ **Removido** o acesso de forma pública (/escolher-tipo e /proprietario)  
✅ **Criado** um sistema de acesso seguro via link com chave  
✅ **Simplificado** o AuthModal - apenas login de usuários após acesso ao painel  

### 📝 Para Modificar a Chave de Acesso

Abra o arquivo `src/pages/AdminPage.tsx` e procure por:

```typescript
const ADMIN_ACCESS_KEY = "admin2024";
```

Altere `"admin2024"` para a chave que você deseja.

### 🌐 URL Estrutura

- Página inicial: `/`
- Agendar como cliente: `/cliente`
- **Painel Admin com chave**: `/admin?key=SEU_CODIGO`
- Política de Cookies: `/politica-cookies`

### 📋 Notas Importantes

- A chave é **sensível a maiúsculas e minúsculas**
- O acesso é válido por **24 horas** a partir da autenticação
- Ao abrir o link com a chave, a URL é automaticamente limpa (a chave não fica visível na barra de endereços após o login)
- Compartilhe o link apenas com pessoas autorizadas

## Rotas Removidas

As seguintes rotas foram removidas do sistema:
- ❌ `/escolher-tipo` - Página de seleção de tipo de usuário
- ❌ `/proprietario` - Login do proprietário
- ❌ Sistema de cadastro de usuários (sign-up)

## Acesso ao Admin

Usuários agora acessam o painel admin apenas através do **link com chave de segurança**, sem necessidade de cadastro prévio.
