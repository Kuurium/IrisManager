import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerFormComponent implements OnInit {
  @Input() customerToEdit: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);

  customerForm: FormGroup;
  clienteId: number | null = null;

  constructor() {
    this.customerForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9\\-]{8,}$')]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.customerToEdit) {
      this.clienteId = this.customerToEdit.id;
      const dataToPatch = { ...this.customerToEdit };
      if (dataToPatch.phone) {
        dataToPatch.phone = this.formatPhone(dataToPatch.phone);
      }
      this.customerForm.patchValue(dataToPatch);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  private formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.customerForm.value };
    if (formValue.phone) {
      formValue.phone = this.formatPhone(formValue.phone);
    }

    if (this.clienteId && this.clienteId > 0) {
      this.customerService.updateCustomer(this.clienteId, formValue).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Cliente actualizado correctamente.', 'success');
          this.saved.emit();
        },
        error: (err: any) => {
          Swal.fire('Error', err.message || 'Hubo un problema al actualizar.', 'error');
        }
      });
    } else {
      this.customerService.createCustomer(formValue).subscribe({
        next: () => {
          Swal.fire('¡Guardado!', 'Cliente guardado correctamente.', 'success');
          this.saved.emit();
        },
        error: (err: any) => {
          Swal.fire('Error', err.message || 'Hubo un problema al crear.', 'error');
        }
      });
    }
  }
}