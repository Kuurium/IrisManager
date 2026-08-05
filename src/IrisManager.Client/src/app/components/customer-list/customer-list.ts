import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];
  sortColumn: string = '';
  sortAscending: boolean = true;

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  edit(customer: Customer) {
    this.router.navigate(['/clientes/editar', customer.id]);
  }

  delete(id: number) {
    if(confirm('¿Estás seguro de eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.cargarClientes();
      });
    }
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
  
  }
}