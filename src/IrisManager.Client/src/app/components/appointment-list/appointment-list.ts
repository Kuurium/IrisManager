import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment';
import { Appointment } from '../../core/models/appointment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadAppointments();
  }

  traducirEstado(estado: string): string {
    const diccionarioEstados: { [key: string]: string } = {
      'Scheduled': 'Programada',
      'Completed': 'Completada',
      'Cancelled': 'Cancelada'
    };
    return diccionarioEstados[estado] || estado;
  }

  traducirPago(metodo: string | number): string {
    if (metodo === null || metodo === undefined || metodo === '') {
      return 'No definido';
    }
    const diccionarioPagos: { [key: string]: string } = {
      'Cash': 'Efectivo',
      'CreditCard': 'Tarjeta',
      'Transfer': 'Transferencia',
      '0': 'Efectivo',
      '1': 'Tarjeta',
      '2': 'Transferencia'
    };
    return diccionarioPagos[metodo.toString()] || metodo.toString();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las citas', err);
        Swal.fire('Error', 'Hubo un problema al cargar la lista de citas.', 'error');
      }
    });
  }

  deleteAppointment(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción cancelará o eliminará la cita del sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
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
            console.error('Error al eliminar', err);
            Swal.fire('Error', 'No se pudo eliminar la cita.', 'error');
          }
        });
      }
    });
  }
}