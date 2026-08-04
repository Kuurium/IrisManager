import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from './core/services/customer.service';
import { CustomerListComponent } from './components/customer-list/customer-list';
import { CustomerFormComponent } from './components/customer-form/customer-form';
import { StylistService } from './core/services/stylist.service';
import { Customer } from './core/models/customer';
import { StylistListComponent } from './components/stylist-list/stylist-list';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  // <-- COMPONENTE AÑADIDO AQUÍ
  imports: [FormsModule, CustomerListComponent, CustomerFormComponent, StylistListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class AppComponent implements OnInit {
  title = 'IrisManager.Client';

  private customerService = inject(CustomerService);
  private cdr = inject(ChangeDetectorRef);
  private stylistService = inject(StylistService);

  customers: Customer[] = []; 

  newCustomer: Customer = { name: '', email: '', phone: '' };
  editingCustomerId: number | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  sortColumn: string = '';
  sortAscending: boolean = true;

  handleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
  }

  get sortedCustomers() {
    if (!this.sortColumn) return this.filteredCustomers;

    return [...this.filteredCustomers].sort((a, b) => {
      const valA = String((a as any)[this.sortColumn]).toLowerCase();
      const valB = String((b as any)[this.sortColumn]).toLowerCase();
      
      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  get paginatedCustomers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.sortedCustomers.slice(startIndex, endIndex); 
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return new Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get filteredCustomers(): Customer[] {
    if (!this.searchTerm) {
      return this.customers; 
    }
    
    const term = this.searchTerm.toLowerCase();
    
    return this.customers.filter(customer => 
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.includes(term)
    );
  }

  ngOnInit(): void {
    this.loadCustomers();

    this.stylistService.getStylists().subscribe({
      next: (data) => {
        console.log(' Conexión exitosa. Estilistas recibidos:', data);
      },
      error: (error) => {
        console.error(' Error al conectar con la API de estilistas:', error);
      }
    });
  }

  loadCustomers() {
    this.isLoading = true; 

    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.email || !this.newCustomer.phone) {
      Swal.fire({
        icon: 'error',
        title: 'Faltan datos',
        text: 'Por favor llena todos los campos requeridos.'
      });
      return;
    }

    if (this.editingCustomerId) {
      this.customerService.updateCustomer(this.editingCustomerId, this.newCustomer).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'El cliente se actualizó correctamente.', 'success');
          this.loadCustomers();
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.customerService.createCustomer(this.newCustomer).subscribe({
        next: (response) => {
          Swal.fire('¡Guardado!', 'El cliente se guardó correctamente.', 'success');
          this.loadCustomers(); 
          this.resetForm();
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  editCustomer(customer: Customer) {
    this.editingCustomerId = customer.id ?? null;
    this.newCustomer = { ...customer }; 
  }

  deleteCustomer(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(id).subscribe({
          next: () => {
            this.customers = this.customers.filter(c => c.id !== id);
            this.cdr.detectChanges(); 
            
           
            Swal.fire('¡Eliminado!', 'El cliente ha sido borrado.', 'success');
          },
          error: (err) => console.error('Error al eliminar:', err)
        });
      }
    });
  }

  resetForm() {
    this.newCustomer = { name: '', email: '', phone: '' };
    this.editingCustomerId = null;
  }
}