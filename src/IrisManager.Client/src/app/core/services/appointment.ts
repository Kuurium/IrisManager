import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentCreateDTO } from '../models/appointment';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/appointments`; 

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: AppointmentCreateDTO): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: AppointmentCreateDTO): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}`, appointment);
}

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAppointmentsByStylistAndDate(stylistId: number, date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}?stylistId=${stylistId}&date=${date}`);
  }
}