import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentCreateDTO, AppointmentUpdateDTO, AppointmentUpdateStatusDTO } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'https://localhost:7154/api/appointments';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: AppointmentCreateDTO): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: AppointmentUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, appointment);
  }

  updateAppointmentStatus(id: number, statusDto: AppointmentUpdateStatusDTO): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, statusDto);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}