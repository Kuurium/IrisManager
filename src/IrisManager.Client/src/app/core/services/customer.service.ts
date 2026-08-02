import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7154/api/customers'; 

  getCustomers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  createCustomer(customer: any): Observable<any> {
    return this.http.post(this.apiUrl, customer);
  }
  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
