# 🔧 Debug Rápido - Testando Firestore Rules

**IMPORTANTE:** Execute estes comandos **no console do navegador** (F12) **na página `/cliente`** após publicar as regras no Firebase Console.

## 📋 Teste Correto (Código Simples)

**Execute estes comandos no console (F12) na página `/cliente`:**

```javascript
// Teste 1: Verificar se Firebase debug está disponível
console.log("Firebase Debug OK:", typeof window.firebaseDebug);
console.log("DB OK:", typeof window.firebaseDebug?.db);
console.log("getDocs OK:", typeof window.firebaseDebug?.getDocs);

// Teste 2: Verificar barbeiros
(async () => {
  try {
    const { db, collection, getDocs } = window.firebaseDebug;
    const barbersSnap = await getDocs(collection(db, "barbers"));
    console.log("✅ Barbeiros encontrados:", barbersSnap.docs.length);
    barbersSnap.docs.forEach(doc => console.log("👨", doc.data().name));
  } catch (err) {
    console.log("❌ Erro barbeiros:", err.message);
  }
})();

// Teste 3: Verificar serviços
(async () => {
  try {
    const { db, collection, getDocs } = window.firebaseDebug;
    const servicesSnap = await getDocs(collection(db, "services"));
    console.log("✅ Serviços encontrados:", servicesSnap.docs.length);
    servicesSnap.docs.forEach(doc => console.log("✂️", doc.data().name, "- R$", doc.data().price));
  } catch (err) {
    console.log("❌ Erro serviços:", err.message);
  }
})();
```

## 📋 Teste Avançado (Usando Firebase Direto)

Se o teste simples não funcionar, use este código mais avançado:

```javascript
// Execute na página /cliente ou /admin
(async () => {
  try {
    // O Firebase já está inicializado na página
    const db = getFirestore();
    
    console.log("🔍 Testando leitura de barbeiros...");
    const barbersSnap = await getDocs(collection(db, "barbers"));
    console.log("✅ Barbeiros:", barbersSnap.docs.length);
    
    console.log("🔍 Testando leitura de serviços...");
    const servicesSnap = await getDocs(collection(db, "services"));
    console.log("✅ Serviços:", servicesSnap.docs.length);
    
    console.log("🎉 Firestore funcionando!");
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
    console.log("💡 Solução: Publique as regras no Firebase Console");
  }
})();
```

## 🚨 Problemas Comuns

## 🚨 Problemas Comuns

### Erro: "firebaseDebug is not defined"
- Recarregue a página `/cliente` completamente (Ctrl+F5)
- O código de debug foi adicionado temporariamente ao `firebase.ts`
- Deve aparecer "🔧 Firebase debug exposto globalmente" no console

### Erro: "Missing or insufficient permissions"
- Você **não publicou** as regras no Firebase Console
- Vá em: Firebase Console → Firestore → Rules → **Publish**

### Erro: "No Firebase App '[DEFAULT]' has been created"
- Recarregue a página completamente
- Certifique-se de estar na página `/cliente` da aplicação

### Erro: "Collection not found"
- As collections ainda não existem
- Adicione barbeiros/serviços via admin primeiro

### Erro: "Auth required"
- Você não está logado
- Acesse `/admin?key=admin2024` primeiro

## ✅ Como deve ficar após funcionar

Após publicar as regras corretamente, você deve ver no console:
```
✅ Barbeiros encontrados: 2
👨 João Silva
👨 Pedro Costa
✅ Serviços encontrados: 3
✂️ Corte Masculino - R$ 50
✂️ Barba Completa - R$ 35
✂️ Corte + Barba - R$ 75
```

## 📋 Checklist para funcionar

- [ ] Acesse Firebase Console
- [ ] Vá para Firestore Database → Rules
- [ ] Cole as regras do `FIRESTORE_SECURITY_RULES.md`
- [ ] Clique em **"Publish"**
- [ ] Aguarde alguns segundos
- [ ] Recarregue a página `/cliente`
- [ ] Execute os testes acima
- [ ] Deve funcionar sem erros!

---

## 🆘 Se ainda não funcionar

### Verifique as regras publicadas:
1. Firebase Console → Firestore → Rules
2. Deve aparecer as regras com `barbers` e `services`
3. Deve ter `allow read: if true;` para ambas

### Teste alternativo:
```javascript
// Execute este código simples primeiro
console.log("Firebase disponível:", typeof getFirestore);
console.log("Collection disponível:", typeof collection);
console.log("getDocs disponível:", typeof getDocs);
```

Se mostrar "undefined", a página não carregou o Firebase corretamente.