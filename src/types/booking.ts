export interface Customer {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface SubService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Employee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Appointment {
  customer?: Customer;
  service?: Service;
  subService?: SubService;
  employee?: Employee;
  startTime?: string;
  endTime?: string;
  price?: number;
  duration?: number;
}

export interface BookingState {
  currentStep: number;
  selectedTime: string;
  appointments: Appointment[];
  currentAppointmentIndex: number;
  appointmentType: string | null;
}
