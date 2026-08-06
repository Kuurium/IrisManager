import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Stylist, StylistCreateDTO } from '../models/stylist';

@Injectable({
  providedIn: 'root'
})
export class StylistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/stylists`;

  getStylists(): Observable<Stylist[]> {
    return this.http.get<Stylist[]>(this.apiUrl);
  }

  getStylist(id: number): Observable<Stylist> {
    return this.http.get<Stylist>(`${this.apiUrl}/${id}`);
  }

  getStylistsByService(serviceId: number): Observable<Stylist[]> {
  return this.http.get<Stylist[]>(`${this.apiUrl}/by-service/${serviceId}`);
}

  createStylist(stylist: StylistCreateDTO): Observable<Stylist> {
    return this.http.post<Stylist>(this.apiUrl, stylist);
  }

  updateStylist(id: number, stylist: Stylist): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, stylist);
  }

  deleteStylist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}