import { collection, addDoc, query, where, getDocs, getDoc, Timestamp, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export interface Service {
  id: string;
  name: string;
  price: number;
  estimatedTime: number; // em minutos
}

export interface Barber {
  id: string;
  name: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  birthDate: string;
  howDidYouKnow: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AppointmentData {
  userId: string | null;
  name: string;
  phone: string;
  cpf?: string;
  email: string;
  date: string;
  time: string;
  barberId: string;
  services: string[];
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export const appointmentsService = {
  // Salvar novo agendamento
  async createAppointment(data: AppointmentData) {
    console.log('🔍 appointmentsService.createAppointment - Iniciando...');
    console.log('👤 Usuário atual:', auth.currentUser?.uid);
    console.log('📝 Dados do agendamento:', data);

    try {
      const docRef = await addDoc(collection(db, "appointments"), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Agendamento criado com sucesso! ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('❌ Erro ao criar agendamento:', error);
      console.error('🔍 Detalhes do erro:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  // Obter agendamentos do usuário
  async getUserAppointments(userId: string): Promise<any[]> {
    console.log('🔍 appointmentsService.getUserAppointments - Buscando para usuário:', userId);
    try {
      const q = query(collection(db, "appointments"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      console.log('✅ Agendamentos do usuário encontrados:', querySnapshot.docs.length);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error: any) {
      console.error('❌ Erro ao buscar agendamentos do usuário:', error);
      throw error;
    }
  },

  // Obter todos os agendamentos confirmados (para o painel do admin)
  async getAllConfirmedAppointments() {
    console.log('🔍 appointmentsService.getAllConfirmedAppointments - Buscando todos os confirmados');
    console.log('👤 Usuário atual:', auth.currentUser?.uid);

    try {
      const q = query(
        collection(db, "appointments"),
        where("status", "==", "confirmed")
      );
      const querySnapshot = await getDocs(q);
      console.log('✅ Agendamentos confirmados encontrados:', querySnapshot.docs.length);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error: any) {
      console.error('❌ Erro ao buscar agendamentos confirmados:', error);
      console.error('🔍 Detalhes do erro:', {
        code: error.code,
        message: error.message
      });
      throw error;
    }
  },

  async getAllActiveAppointments() {
    console.log('🔍 appointmentsService.getAllActiveAppointments - Buscando todos os agendamentos ativos');
    console.log('👤 Usuário atual:', auth.currentUser?.uid);

    try {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointments: any[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      const activeAppointments = appointments.filter((apt) => apt.status !== "cancelled");
      console.log('✅ Agendamentos ativos encontrados:', activeAppointments.length);
      return activeAppointments;
    } catch (error: any) {
      console.error('❌ Erro ao buscar agendamentos ativos:', error);
      console.log('🔧 Código do erro:', error.code);
      console.log('🔧 Mensagem do erro:', error.message);

      // Retornar dados mock para desenvolvimento/teste
      console.log('🔧 Usando dados mock devido a erro');
      return this.getMockAppointments();
    }
  },

  // Obter horários reservados de uma data
  async getReservedSlots(date: string) {
    console.log('🔍 appointmentsService.getReservedSlots - Verificando horários para:', date);
    try {
      const q = query(
        collection(db, "appointments"),
        where("date", "==", date),
        where("status", "!=", "cancelled")
      );
      const querySnapshot = await getDocs(q);
      const times = querySnapshot.docs.map((doc) => doc.data().time);
      console.log('✅ Horários reservados encontrados:', times);
      return times;
    } catch (error: any) {
      console.error('❌ Erro ao buscar horários reservados:', error);
      throw error;
    }
  },

  // Atualizar status do agendamento
  async updateAppointmentStatus(appointmentId: string, status: "pending" | "confirmed" | "completed" | "cancelled") {
    console.log('🔍 appointmentsService.updateAppointmentStatus - Atualizando:', appointmentId, 'para:', status);
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, {
        status,
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Status atualizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar agendamento:', error);
      throw error;
    }
  },

  // Remover agendamento do usuário
  async deleteAppointment(appointmentId: string) {
    console.log('🔍 appointmentsService.deleteAppointment - Deletando:', appointmentId);
    try {
      await deleteDoc(doc(db, "appointments", appointmentId));
      console.log('✅ Agendamento removido com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao deletar agendamento:', error);
      throw error;
    }
  },

  // ===== SERVIÇOS =====
  // Obter todos os serviços
  async getServices(): Promise<Service[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
    } catch (error: any) {
      console.error('❌ Erro ao buscar serviços:', error);

      // Retornar dados mock para desenvolvimento/teste
      if (error.code === 'permission-denied' || error.message?.includes('Missing or insufficient permissions')) {
        console.log('🔧 Usando dados mock de serviços devido a erro de permissões');
        return this.getMockServices();
      }

      throw error;
    }
  },

  // Adicionar serviço
  async addService(service: Omit<Service, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, "services"), service);
      return docRef.id;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar serviço:', error);
      throw error;
    }
  },

  // Atualizar serviço
  async updateService(serviceId: string, service: Omit<Service, 'id'>) {
    try {
      const serviceRef = doc(db, "services", serviceId);
      await updateDoc(serviceRef, service);
    } catch (error: any) {
      console.error('❌ Erro ao atualizar serviço:', error);
      throw error;
    }
  },

  // Deletar serviço
  async deleteService(serviceId: string) {
    try {
      await deleteDoc(doc(db, "services", serviceId));
    } catch (error: any) {
      console.error('❌ Erro ao deletar serviço:', error);
      throw error;
    }
  },

  // ===== BARBEIROS =====
  // Obter todos os barbeiros
  async getBarbers(): Promise<Barber[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "barbers"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Barber[];
    } catch (error: any) {
      console.error('❌ Erro ao buscar barbeiros:', error);
      throw error;
    }
  },

  // Adicionar barbeiro
  async addBarber(barber: Omit<Barber, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, "barbers"), barber);
      return docRef.id;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar barbeiro:', error);
      throw error;
    }
  },

  // Atualizar barbeiro
  async updateBarber(barberId: string, barber: Omit<Barber, 'id'>) {
    try {
      const barberRef = doc(db, "barbers", barberId);
      await updateDoc(barberRef, barber);
    } catch (error: any) {
      console.error('❌ Erro ao atualizar barbeiro:', error);
      throw error;
    }
  },

  // Deletar barbeiro
  async deleteBarber(barberId: string) {
    try {
      await deleteDoc(doc(db, "barbers", barberId));
    } catch (error: any) {
      console.error('❌ Erro ao deletar barbeiro:', error);
      throw error;
    }
  },

  // Obter horários reservados por barbeiro e data
  async getReservedSlotsByBarber(barberId: string, date: string) {
    try {
      const q = query(
        collection(db, "appointments"),
        where("barberId", "==", barberId),
        where("date", "==", date),
        where("status", "!=", "cancelled")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data().time);
    } catch (error: any) {
      console.error('❌ Erro ao buscar horários reservados do barbeiro:', error);
      throw error;
    }
  },

  // Logout do usuário
  async signOut() {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('❌ Erro ao fazer logout:', error);
      throw error;
    }
  },

  // Salvar dados do perfil do usuário
  async saveUserProfile(userId: string, profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) {
    try {
      const userProfileRef = doc(db, "userProfiles", userId);
      await setDoc(userProfileRef, {
        ...profileData,
        uid: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }, { merge: true });
      console.log('✅ Perfil do usuário salvo com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao salvar perfil do usuário:', error);
      throw error;
    }
  },

  // Obter dados do perfil do usuário
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userProfileRef = doc(db, "userProfiles", userId);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        return {
          uid: userProfileSnap.id,
          ...userProfileSnap.data(),
        } as UserProfile;
      }

      return null;
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  },

  // Deletar perfil do usuário
  async deleteUserProfile(userId: string) {
    try {
      const userProfileRef = doc(db, "userProfiles", userId);
      await deleteDoc(userProfileRef);
      console.log('✅ Perfil do usuário deletado com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao deletar perfil do usuário:', error);
      throw error;
    }
  },

  // Dados mock para desenvolvimento/teste
  getMockAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return [
      {
        id: 'mock-1',
        name: 'João Silva',
        phone: '(51) 99999-9999',
        email: 'joao@email.com',
        date: today,
        time: '09:00',
        barberId: 'barber-1',
        services: ['service-1'],
        notes: 'Cliente regular',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-2',
        name: 'Maria Santos',
        phone: '(51) 88888-8888',
        email: 'maria@email.com',
        date: today,
        time: '14:00',
        barberId: 'barber-1',
        services: ['service-2', 'service-3'],
        notes: '',
        status: 'completed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-3',
        name: 'Pedro Oliveira',
        phone: '(51) 77777-7777',
        email: 'pedro@email.com',
        date: tomorrow,
        time: '10:00',
        barberId: 'barber-2',
        services: ['service-1'],
        notes: 'Primeira vez',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-4',
        name: 'Ana Costa',
        phone: '(51) 66666-6666',
        email: 'ana@email.com',
        date: yesterday,
        time: '16:00',
        barberId: 'barber-1',
        services: ['service-3'],
        notes: '',
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
  },

  getMockServices(): Service[] {
    return [
      {
        id: 'service-1',
        name: 'Corte Masculino',
        price: 50,
        estimatedTime: 60
      },
      {
        id: 'service-2',
        name: 'Barba Completa',
        price: 35,
        estimatedTime: 30
      },
      {
        id: 'service-3',
        name: 'Corte + Barba',
        price: 75,
        estimatedTime: 90
      },
      {
        id: 'service-4',
        name: 'Tratamento Capilar',
        price: 60,
        estimatedTime: 45
      }
    ];
  },
};
