import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerFormComponent implements OnInit {
  
  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  customerForm: FormGroup;
  clienteId: number | null = null;

  constructor() {
    this.customerForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,}$')]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.clienteId = Number(id);
        this.cargarCliente(this.clienteId);
      }
    });
  }

  cargarCliente(id: number) {
    this.customerService.getCustomerById(id).subscribe({
      next: (cliente: any) => {
        this.customerForm.patchValue(cliente);
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la información del cliente.', 'error').then(() => {
          this.router.navigate(['/clientes']);
        });
      }
    });
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

    if (this.clienteId && this.clienteId > 0) {
      this.customerService.updateCustomer(this.clienteId, formValue).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Cliente actualizado correctamente.', 'success').then(() => {
            this.router.navigate(['/clientes']);
          });
        },
        error: (err: any) => {
          Swal.fire('Error', err.message || 'Hubo un problema al actualizar.', 'error');
        }
      });
    } 
    else {
      this.customerService.createCustomer(formValue).subscribe({
        next: () => {
          Swal.fire('¡Guardado!', 'Cliente guardado correctamente.', 'success').then(() => {
            this.router.navigate(['/clientes']);
          });
        },
        error: (err: any) => {
          Swal.fire('Error', err.message || 'Hubo un problema al crear.', 'error');
        }
      });
    }
  }
}