export interface Stylist {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  isActive: boolean;
}

export interface StylistCreateDTO {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  isActive: boolean;
}