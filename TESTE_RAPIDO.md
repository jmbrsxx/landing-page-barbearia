# 🚀 Teste Simples - Firebase Já Carregado!

**Execute estes comandos no console (F12) na página `/cliente`:**

## 📋 Teste 1: Verificar se Firebase debug está disponível

```javascript
console.log("Firebase Debug OK:", typeof window.firebaseDebug);
console.log("DB OK:", typeof window.firebaseDebug?.db);
console.log("getDocs OK:", typeof window.firebaseDebug?.getDocs);
```

**Resultado esperado:**
```
Firebase Debug OK: object
DB OK: object
getDocs OK: function
```

## 📋 Teste 2: Verificar barbeiros

```javascript
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
```

## 📋 Teste 3: Verificar serviços

```javascript
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

---

## 🎯 Se funcionar, você verá:

```
Firebase Debug OK: object
DB OK: object
getDocs OK: function
✅ Barbeiros encontrados: 2
👨 João Silva
👨 Pedro Costa
✅ Serviços encontrados: 3
✂️ Corte Masculino - R$ 50
✂️ Barba Completa - R$ 35
✂️ Corte + Barba - R$ 75
```

---

## 🚨 Se ainda der "Missing or insufficient permissions":

1. **Verifique se publicou as regras no Firebase Console**
2. Vá em: https://console.firebase.google.com/
3. Firestore Database → Rules
4. Deve ter as regras com `barbers` e `services`
5. Clique em **"Publish"** se não clicou ainda

---

## 💡 Como funciona:

O Firebase já está inicializado na aplicação. Adicionei temporariamente um código que expõe as funções em `window.firebaseDebug` para facilitar os testes no console.

---

## 🧹 Limpeza (depois de testar):

Após confirmar que funciona, abra `src/lib/firebase.ts` e remova estas linhas:
```javascript
// TEMPORÁRIO: Expor Firebase globalmente para debug (remover depois)
if (typeof window !== 'undefined') {
  (window as any).firebaseDebug = {
    db,
    getFirestore: () => db,
    collection: (await import('firebase/firestore')).collection,
    getDocs: (await import('firebase/firestore')).getDocs,
    addDoc: (await import('firebase/firestore')).addDoc,
    doc: (await import('firebase/firestore')).doc,
    updateDoc: (await import('firebase/firestore')).updateDoc,
    deleteDoc: (await import('firebase/firestore')).deleteDoc,
  };
  console.log("🔧 Firebase debug exposto globalmente em window.firebaseDebug");
}
```

---

## 📞 Teste completo único

Ou execute tudo de uma vez:

```javascript
(async () => {
  console.log("🔍 Iniciando testes...");
  
  try {
    const { db, collection, getDocs } = window.firebaseDebug;
    
    const barbersSnap = await getDocs(collection(db, "barbers"));
    console.log("✅ Barbeiros:", barbersSnap.docs.length);
    
    const servicesSnap = await getDocs(collection(db, "services"));
    console.log("✅ Serviços:", servicesSnap.docs.length);
    
    console.log("🎉 Tudo funcionando!");
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
    
    if (error.message.includes("permissions")) {
      console.log("💡 Solução: Publique as regras no Firebase Console");
    }
  }
})();
```