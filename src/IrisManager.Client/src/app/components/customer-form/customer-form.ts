import { Component, inject, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerFormComponent implements OnChanges {
  @Input() customer: Customer | null = null;
  @Output() onSave = new EventEmitter<void>();
  
  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);

  customerForm: FormGroup;

  constructor() {
    this.customerForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,}$')]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customer'] && changes['customer'].currentValue) {
      this.customerForm.patchValue(changes['customer'].currentValue);
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Faltan datos',
        text: 'Por favor verifica los campos marcados en rojo.'
      });
      return;
    }

    const formValue = this.customerForm.value;

    if (formValue.id && formValue.id > 0) {
      this.customerService.updateCustomer(formValue.id, formValue).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Cliente actualizado correctamente.', 'success');
          this.onSave.emit();
          this.customerForm.reset({ id: 0, name: '', email: '', phone: '' });
        },
        error: (err: any) => {
          Swal.fire('Error', err.message || 'Hubo un problema al actualizar.', 'error');
        }
      });
    } 
    // 4. Lógica de Creación
    else {
      this.customerService.createCustomer(formValue).subscribe({
        next: () => {
          Swal.fire('¡Guardado!', 'Cliente guardado correctamente.', 'success');
          this.onSave.emit();
          this.customerForm.reset({ id: 0, name: '', email: '', phone: '' });
        },
        error: (err: any) => {
          Swal.fire('Error', err.message || 'Hubo un problema al crear.', 'error');
        }
      });
    }
  }
}