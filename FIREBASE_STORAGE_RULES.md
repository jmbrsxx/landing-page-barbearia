# Firebase Storage Security Rules

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Regras para fotos de perfil
    match /profile-photos/{userId}/{allPaths=**} {
      // Apenas o próprio usuário pode fazer upload, ler e deletar suas fotos
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Regras padrão - negar tudo que não estiver especificado acima
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}