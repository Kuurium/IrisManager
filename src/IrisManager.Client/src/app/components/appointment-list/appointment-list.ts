import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment';
import { Appointment } from '../../core/models/appointment';
import { AppointmentFormComponent } from '../appointment-form/appointment-form';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, AppointmentFormComponent],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  showInactiveCustomers: boolean = false;

  showModal: boolean = false;
  selectedAppointment: Appointment | null = null;

  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las citas:', err);
        Swal.fire('Error', 'Hubo un problema al cargar la lista de citas.', 'error');
      }
    });
  }

  get filteredAppointments(): Appointment[] {
    if (this.showInactiveCustomers) {
      return this.appointments;
    }
    return this.appointments.filter((apt) => apt.isCustomerActive !== false);
  }

  toggleInactiveFilter(): void {
    this.showInactiveCustomers = !this.showInactiveCustomers;
    this.cdr.detectChanges();
  }

  openModal(appointment?: Appointment): void {
    this.selectedAppointment = appointment || null;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAppointment = null;
    this.cdr.detectChanges();
  }

  onModalSaved(): void {
    this.closeModal();
    this.loadAppointments();
  }

  deleteAppointment(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la cita de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.deleteAppointment(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La cita ha sido eliminada.', 'success');
            this.loadAppointments();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la cita.', 'error');
          }
        });
      }
    });
  }

  traducirEstado(estado: string | null | undefined): string {
    if (!estado) return '';

    const diccionarioEstados: { [key: string]: string } = {
      scheduled: 'Programada',
      rescheduled: 'Reprogramada',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };

    const clave = estado.toLowerCase().trim();
    return diccionarioEstados[clave] || estado;
  }

  traducirPago(metodo: string | null | undefined): string {
    if (!metodo || metodo.trim() === '') return 'Pendiente';

    const mapaPagos: { [key: string]: string } = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      pending: 'Pendiente'
    };

    const clave = metodo.toLowerCase().trim();
    return mapaPagos[clave] || metodo;
  }
}