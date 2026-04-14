const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, Timestamp } = require('firebase/firestore');

// Firebase config from environment
const firebaseConfig = {
  apiKey: "AIzaSyDHJZmEtxchCzlscp4HJKwcE3VDITkJQVs",
  authDomain: "barbearia-52835.firebaseapp.com",
  projectId: "barbearia-52835",
  storageBucket: "barbearia-52835.firebasestorage.app",
  messagingSenderId: "899346367947",
  appId: "1:899346367947:web:fb4ec92b14ecbbd5d4e24e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAppointments() {
  console.log('🔍 Verificando agendamentos existentes...');

  try {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const appointments = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        date: data.date,
        time: data.time,
        status: data.status,
        name: data.name,
        services: data.services,
        createdAt: data.createdAt
      });
    });

    console.log(`📊 Encontrados ${appointments.length} agendamentos:`);
    appointments.forEach(apt => {
      console.log(`  - ID: ${apt.id}, Data: ${apt.date}, Hora: ${apt.time}, Status: ${apt.status}`);
    });

    return appointments;
  } catch (error) {
    console.error('❌ Erro ao verificar agendamentos:', error);
    return [];
  }
}

async function createTestAppointments() {
  console.log('🔧 Criando agendamentos de teste...');

  const today = new Date().toISOString().split('T')[0];

  const testAppointments = [
    {
      userId: null,
      name: 'João Silva',
      phone: '(51) 99999-9999',
      email: 'joao@email.com',
      date: today,
      time: '09:00',
      barberId: 'barber-1',
      services: ['service-1'],
      notes: 'Cliente regular',
      status: 'confirmed',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      userId: null,
      name: 'Maria Santos',
      phone: '(51) 88888-8888',
      email: 'maria@email.com',
      date: today,
      time: '14:00',
      barberId: 'barber-1',
      services: ['service-2', 'service-3'],
      notes: '',
      status: 'completed',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      userId: null,
      name: 'Pedro Oliveira',
      phone: '(51) 77777-7777',
      email: 'pedro@email.com',
      date: today,
      time: '16:00',
      barberId: 'barber-2',
      services: ['service-1'],
      notes: 'Primeira vez',
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  const createdIds = [];
  for (const apt of testAppointments) {
    try {
      const docRef = await addDoc(collection(db, "appointments"), apt);
      createdIds.push(docRef.id);
      console.log(`✅ Agendamento criado: ${docRef.id}`);
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
    }
  }

  return createdIds;
}

async function main() {
  // Check existing appointments
  const existing = await checkAppointments();

  // If no appointments exist, create test ones
  if (existing.length === 0) {
    console.log('\n📝 Nenhum agendamento encontrado. Criando dados de teste...');
    const created = await createTestAppointments();
    console.log(`✅ Criados ${created.length} agendamentos de teste`);

    // Check again
    console.log('\n🔄 Verificando novamente após criação...');
    await checkAppointments();
  } else {
    console.log(`\n✅ Já existem ${existing.length} agendamentos no Firestore`);
  }
}

main().catch(console.error);