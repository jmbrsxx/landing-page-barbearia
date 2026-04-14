import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebase-credentials.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def check_appointments():
    """Check existing appointments in Firestore"""
    print("🔍 Verificando agendamentos existentes...")

    try:
        appointments_ref = db.collection('appointments')
        docs = appointments_ref.stream()

        appointments = []
        for doc in docs:
            data = doc.to_dict()
            appointments.append({
                'id': doc.id,
                'date': data.get('date'),
                'time': data.get('time'),
                'status': data.get('status'),
                'name': data.get('name'),
                'services': data.get('services'),
                'createdAt': str(data.get('createdAt')) if data.get('createdAt') else None
            })

        print(f"📊 Encontrados {len(appointments)} agendamentos:")
        for apt in appointments:
            print(f"  - ID: {apt['id']}, Data: {apt['date']}, Hora: {apt['time']}, Status: {apt['status']}")

        return appointments

    except Exception as e:
        print(f"❌ Erro ao verificar agendamentos: {e}")
        return []

def create_test_appointments():
    """Create test appointments"""
    print("🔧 Criando agendamentos de teste...")

    today = datetime.now().strftime('%Y-%m-%d')

    test_appointments = [
        {
            'userId': None,
            'name': 'João Silva',
            'phone': '(51) 99999-9999',
            'email': 'joao@email.com',
            'date': today,
            'time': '09:00',
            'barberId': 'barber-1',
            'services': ['service-1'],
            'notes': 'Cliente regular',
            'status': 'confirmed',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        },
        {
            'userId': None,
            'name': 'Maria Santos',
            'phone': '(51) 88888-8888',
            'email': 'maria@email.com',
            'date': today,
            'time': '14:00',
            'barberId': 'barber-1',
            'services': ['service-2', 'service-3'],
            'notes': '',
            'status': 'completed',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        },
        {
            'userId': None,
            'name': 'Pedro Oliveira',
            'phone': '(51) 77777-7777',
            'email': 'pedro@email.com',
            'date': today,
            'time': '16:00',
            'barberId': 'barber-2',
            'services': ['service-1'],
            'notes': 'Primeira vez',
            'status': 'pending',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
    ]

    created_ids = []
    for apt in test_appointments:
        try:
            doc_ref = db.collection('appointments').add(apt)
            created_ids.append(doc_ref.id)
            print(f"✅ Agendamento criado: {doc_ref.id}")
        except Exception as e:
            print(f"❌ Erro ao criar agendamento: {e}")

    return created_ids

if __name__ == "__main__":
    # Check existing appointments
    existing = check_appointments()

    # If no appointments exist, create test ones
    if len(existing) == 0:
        print("\n📝 Nenhum agendamento encontrado. Criando dados de teste...")
        created = create_test_appointments()
        print(f"✅ Criados {len(created)} agendamentos de teste")

        # Check again
        print("\n🔄 Verificando novamente após criação...")
        check_appointments()
    else:
        print(f"\n✅ Já existem {len(existing)} agendamentos no Firestore")