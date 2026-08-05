import { Customer } from './customer';
import { Stylist } from './stylist';

export interface Appointment {
  id: number;
  customerId: number;
  customerName?: string;
  stylistId: number;
  stylistName?: string;
  serviceId: number;
  serviceName?: string;
  service: string;
  date: string; // Formato YYYY-MM-DD
  time: string; // Formato HH:mm
status: 'Scheduled' | 'Rescheduled' | 'Completed' | 'Cancelled';
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Pendiente';
  notes?: string;
  startTime: Date;
endTime: Date;

  customer?: Customer;
  stylist?: Stylist;
}

export interface AppointmentCreateDTO {
  customerId: number | null;
  stylistId: number | null;
  serviceId: number | null;
  service: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Rescheduled' | 'Completed' | 'Cancelled';
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Pendiente';
  notes: string;
  startTime?: string;
}