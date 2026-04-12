import { collection, addDoc, query, where, getDocs, Timestamp, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
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
  status: "pending" | "confirmed" | "cancelled";
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
  async getUserAppointments(userId: string) {
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
  async updateAppointmentStatus(appointmentId: string, status: "pending" | "confirmed" | "cancelled") {
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
};
