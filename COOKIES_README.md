# Banner de Cookies

## Funcionalidades

O banner de cookies aparece automaticamente quando um usuário visita o site pela primeira vez. Ele informa sobre o uso de cookies e solicita consentimento.

## Componentes Criados

### CookieBanner.tsx
- Banner fixo no fundo da página
- Aparece apenas para usuários que ainda não aceitaram cookies
- Botão "Aceitar" salva a preferência no localStorage
- Botão "X" fecha o banner temporariamente
- Link para página de política de cookies

### CookiePolicy.tsx
- Página completa explicando o uso de cookies
- Seções sobre tipos de cookies, terceiros e gerenciamento
- Design consistente com o resto do site

## Como Funciona

1. **Primeira visita**: Banner aparece automaticamente
2. **Aceitar cookies**: Salva `cookiesAccepted: "true"` no localStorage
3. **Banner não aparece mais**: Para usuários que já aceitaram
4. **Link permanente**: Política de cookies sempre acessível no footer

## Personalização

### Estilos
- Cores: Laranja para cookies (text-orange-500)
- Posicionamento: Fixo no bottom da tela
- Responsivo: Adapta para mobile e desktop

### Comportamento
- Fecha automaticamente ao aceitar
- Pode ser fechado sem aceitar (aparecerá novamente)
- Não bloqueia navegação

## Tecnologias

- React com hooks (useState, useEffect)
- Tailwind CSS para estilização
- localStorage para persistência
- React Router para navegação

## LGPD Compliance

O banner atende aos requisitos básicos da LGPD:
- ✅ Informa sobre uso de cookies
- ✅ Solicita consentimento explícito
- ✅ Permite acesso à política completa
- ✅ Registra preferência do usuário