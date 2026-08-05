import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentCreateDTO } from '../../core/models/appointment';
import { Customer } from '../../core/models/customer';
import { Stylist } from '../../core/models/stylist';
import { AppointmentService } from '../../core/services/appointment';
import { CustomerService } from '../../core/services/customer.service';
import { StylistService } from '../../core/services/stylist.service';
import { Service } from '../../core/models/service';
import { ServiceService } from '../../core/services/service.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss'
})
export class AppointmentFormComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private customerService = inject(CustomerService);
  private stylistService = inject(StylistService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private serviceService = inject(ServiceService);

  customers: Customer[] = [];
  stylists: Stylist[] = [];
  services: Service[] = [];

  formData: AppointmentCreateDTO = {
    customerId: null,
    stylistId: null,
    serviceId: null,
    service: '',
    date: '',
    time: '',
    status: 'Scheduled',
    paymentMethod: 'Pendiente',
    notes: ''
  };

  isEditMode = false;
  appointmentId: number | null = null;

  ngOnInit(): void {
    this.loadCustomers();
    this.loadStylists();
    this.loadServices();

    this.route.paramMap.subscribe(params => {
  const id = params.get('id');
  if (id) {
    this.isEditMode = true;
    this.appointmentId = +id;
      }
    });
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data) => this.services = data,
      error: () => console.error('Error al cargar servicios')
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers = data,
      error: () => console.error('Error al cargar clientes')
    });
  }

  loadStylists(): void {
    this.stylistService.getStylists().subscribe({
      next: (data) => this.stylists = data.filter(s => s.isActive),
      error: () => console.error('Error al cargar estilistas')
    });
  }

loadAppointmentData(id: number): void {
  this.appointmentService.getAppointment(id).subscribe({
    next: (data) => {
      let formattedDate = '';
      let formattedTime = '';

      if (data.startTime) {
        const dateObj = new Date(data.startTime);
        
        const year = dateObj.getFullYear();
         const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
         const day = ('0' + dateObj.getDate()).slice(-2);
         this.formData.date = `${year}-${month}-${day}`;
        
        const hours = ('0' + dateObj.getHours()).slice(-2);
         const minutes = ('0' + dateObj.getMinutes()).slice(-2);
         this.formData.time = `${hours}:${minutes}`;
      }

      this.formData = {
        customerId: data.customerId,
        stylistId: data.stylistId,
        service: data.service,
        serviceId: data.serviceId,
        status: data.status,
        paymentMethod: data.paymentMethod,
        notes: data.notes || '',
        date: formattedDate,
        time: formattedTime
      };
    },
    error: () => {
      Swal.fire('Error', 'No se pudo cargar la cita para editar.', 'error');
      this.router.navigate(['/citas']);
    }
  });
}

  save(): void {
    if (!this.formData.customerId || !this.formData.stylistId || !this.formData.serviceId || !this.formData.date || !this.formData.time) {
      Swal.fire('Atención', 'Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }
    if (this.formData.date && this.formData.time) {
    this.formData.startTime = `${this.formData.date}T${this.formData.time}:00`;
  }

    this.appointmentService.getAppointmentsByStylistAndDate(this.formData.stylistId, this.formData.date)
      .subscribe({
        next: (existingAppointments) => {
          
          const isOccupied = existingAppointments.some(apt => 
            apt.time === this.formData.time && 
            apt.id !== this.appointmentId &&
            apt.status !== 'Cancelled'
          );

          if (isOccupied) {
            Swal.fire(
              'Estilista no disponible', 
              'El estilista seleccionado ya tiene una cita a esa hora. Por favor, elige otro horario u otro profesional.', 
              'warning'
            );
          } else {
            this.executeSave();
          }
        },
        error: () => {
          Swal.fire('Error', 'No se pudo validar la disponibilidad del estilista con el servidor.', 'error');
        }
      });
  }

executeSave(): void {
  const payload = {
    ...this.formData,
    customerId: Number(this.formData.customerId),
    stylistId: Number(this.formData.stylistId),
    serviceId: Number(this.formData.serviceId),
    startTime: this.formData.startTime,
    date: this.formData.date,
    time: this.formData.time
  };

  if (this.isEditMode && this.appointmentId) {
    this.appointmentService.updateAppointment(this.appointmentId, payload).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Cita actualizada correctamente.', 'success');
        this.router.navigate(['/citas']);
      },
      error: (err) => {
        console.error('Error al actualizar la cita:', err);
        const errorText = JSON.stringify(err);
        if (errorText.includes('already booked')) {
          Swal.fire('Estilista no disponible', 'El estilista seleccionado ya tiene una cita que choca con este horario. Por favor, elige otra hora.', 'warning');
        } else {
          Swal.fire('Error', 'No se pudo actualizar la cita. Revisa la consola para más detalles.', 'error');
        }
      }
    });
  } else {
    this.appointmentService.createAppointment(payload).subscribe({
      next: () => {
        Swal.fire('¡Guardada!', 'La nueva cita ha sido registrada.', 'success');
        this.router.navigate(['/citas']);
      },
      error: (err) => {
        console.error('Error al crear la cita:', err);
        const errorText = JSON.stringify(err);
        if (errorText.includes('already booked')) {
          Swal.fire('Estilista no disponible', 'El estilista seleccionado ya tiene una cita que choca con este horario. Por favor, elige otra hora.', 'warning');
        } else {
          Swal.fire('Error', 'No se pudo guardar la cita. Revisa la consola para más detalles.', 'error');
        }
      }
    });
  }
}
  formatDuration(minutes: number): string {
  if (!minutes) return '0 min';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  } 
  
  return `${hours}h ${remainingMinutes}min`;
}
}