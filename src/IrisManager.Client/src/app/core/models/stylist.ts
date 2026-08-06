export interface Stylist {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  specialty?: string;
  fullSpecialties?: string;
  serviceIds?: number[];
  serviceNames?: string[];
}

export interface StylistCreateDTO {
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  serviceIds?: number[];
}

export interface StylistUpdateDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  serviceIds?: number[];
}