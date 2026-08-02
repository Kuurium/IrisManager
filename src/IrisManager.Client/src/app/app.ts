import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from './core/services/customer.service';
import { CustomerListComponent } from './components/customer-list/customer-list';
import { CustomerFormComponent } from './components/customer-form/customer-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CustomerListComponent, CustomerFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'IrisManager.Client';


  private customerService = inject(CustomerService);

customers: any[] = []; 

newCustomer: any = { name: '', email: '', phone: '' };
editingCustomerId: number | null = null;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Error al cargar', err)
    });
  }

  saveCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.email || !this.newCustomer.phone) {
      alert('Por favor llena todos los campos');
      return;
    }

    if (this.editingCustomerId) {
      this.customerService.updateCustomer(this.editingCustomerId, this.newCustomer).subscribe({
        next: () => {
          console.log(' Cliente actualizado');
          this.loadCustomers();
          this.resetForm();
        },
        error: (err) => console.error(' Error al actualizar:', err)
      });
    } else {
      this.customerService.createCustomer(this.newCustomer).subscribe({
        next: (response) => {
          console.log(' Cliente creado');
          this.loadCustomers(); 
          this.resetForm();
        },
        error: (err) => console.error(' Error al crear:', err)
      });
    }
  }

  editCustomer(customer: any) {
    this.editingCustomerId = customer.id;
    this.newCustomer = { ...customer }; 
  }

  deleteCustomer(id: number) {
    if(confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          console.log(' Cliente eliminado');
          this.customers = this.customers.filter(c => c.id !== id);
        },
        error: (err) => console.error(' Error al eliminar:', err)
      });
    }
  }

  resetForm() {
    this.newCustomer = { name: '', email: '', phone: '' };
    this.editingCustomerId = null;
  }
}