# Problema: Cross-Origin-Opener-Policy (COOP)

## O que está acontecendo:

Você está vendo erros como:
```
Cross-Origin-Opener-Policy policy would block the window.closed call.
```

Isso acontece quando o Firebase Auth tenta abrir um popup para autenticação com Google, mas as políticas de segurança do navegador bloqueiam a comunicação entre janelas.

## Soluções:

### 1. Para Desenvolvimento Local (Recomendado)

Este erro é **normal em desenvolvimento local** e não afeta a funcionalidade. O popup do Google ainda funciona, apenas mostra este aviso no console.

### 2. Se quiser remover o aviso (Opcional)

Adicione ao seu `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
```

### 3. Para Produção

Em produção, este erro não deve aparecer se o domínio estiver corretamente configurado no Firebase Console.

## Verificação:

1. **O popup ainda funciona?** - Mesmo com o erro no console, o login com Google deve funcionar
2. **Teste em produção** - Faça deploy e teste se o erro persiste
3. **Console do navegador** - Os erros de COOP são apenas avisos, não impedem a funcionalidade

## Se o popup NÃO estiver funcionando:

### Verifique no Firebase Console:
1. Vá para **Authentication** → **Sign-in method**
2. Certifique-se que **Google** está habilitado
3. Verifique se o domínio do seu site está na lista de domínios autorizados

### Para localhost (desenvolvimento):
- Adicione `localhost` aos domínios autorizados
- Use `http://localhost:5173` (porta padrão do Vite)

## Status Atual:

✅ **Erro de COOP**: É normal em desenvolvimento, não afeta funcionalidade
❌ **Erro de permissões**: Precisa configurar as regras do Firestore (veja FIRESTORE_SECURITY_RULES.md)