export interface Appointment {
  id: number;
  customerId: number;
  customerName: string;
  isCustomerActive?: boolean;
  stylistId: number;
  stylistName: string;
  serviceId: number;
  serviceName: string;
  servicePrice?: number;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | string;
  paymentMethod?: string;
}

export interface AppointmentCreateDTO {
  customerId: number;
  stylistId: number;
  serviceId: number;
  startTime: string;
  status?: string;
  paymentMethod?: string;
}

export interface AppointmentUpdateDTO {
  id: number;
  customerId: number;
  stylistId: number;
  serviceId: number;
  startTime: string;
  status?: string;
  paymentMethod?: string;
}

export interface AppointmentUpdateStatusDTO {
  status: string;
}