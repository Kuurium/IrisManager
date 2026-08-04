import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from '../../core/models/customer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerListComponent {
  @Input() customers: any[] = []; 
  @Input() sortColumn: string = '';
  @Input() sortAscending: boolean = true;
  
@Output() onEdit = new EventEmitter<Customer>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onSort = new EventEmitter<string>();

  edit(customer: Customer) { this.onEdit.emit(customer); }
  delete(id: number) { this.onDelete.emit(id); }

  sortBy(column: string) {
    this.onSort.emit(column);
  }

    confirmDelete(customer: Customer) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de desactivar al cliente ${customer.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDelete.emit(customer.id);
      }
    });
  }
  
}