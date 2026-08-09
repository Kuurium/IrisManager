import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../core/services/appointment';
import { CustomerService } from '../../core/services/customer.service';
import { StylistService } from '../../core/services/stylist.service';
import { ServiceService } from '../../core/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss'
})
export class AppointmentFormComponent implements OnInit {
  @Input() appointmentToEdit: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private appointmentService = inject(AppointmentService);
  private customerService = inject(CustomerService);
  private stylistService = inject(StylistService);
  private serviceService = inject(ServiceService);

  isEditMode: boolean = false;
  isLoadingStylists: boolean = false;

  customers: any[] = [];
  services: any[] = [];
  stylists: any[] = [];

  formData: any = {
    id: 0,
    customerId: null,
    serviceId: null,
    stylistId: null,
    date: '',
    time: '',
    status: 'Scheduled',
    paymentMethod: 'Pending',
    notes: ''
  };

  ngOnInit(): void {
    this.loadCatalogData();

    if (this.appointmentToEdit) {
      this.isEditMode = true;
      const start = new Date(this.appointmentToEdit.startTime);
      const dateStr = start.toISOString().split('T')[0];
      const timeStr = start.toTimeString().substring(0, 5);

      this.formData = {
        id: this.appointmentToEdit.id,
        customerId: this.appointmentToEdit.customerId,
        serviceId: this.appointmentToEdit.serviceId,
        stylistId: this.appointmentToEdit.stylistId,
        date: dateStr,
        time: timeStr,
        status: this.appointmentToEdit.status || 'Scheduled',
        paymentMethod: this.appointmentToEdit.paymentMethod || 'Pending',
        notes: this.appointmentToEdit.notes || ''
      };

      this.onServiceChange();
    }
  }

  loadCatalogData(): void {
    this.customerService.getCustomers().subscribe({
      next: (res) => (this.customers = res.filter((c: any) => c.isActive !== false))
    });

    this.serviceService.getServices().subscribe({
      next: (res) => (this.services = res)
    });
  }

  onServiceChange(): void {
    if (!this.formData.serviceId) {
      this.stylists = [];
      return;
    }

    this.isLoadingStylists = true;
    this.stylistService.getStylists().subscribe({
      next: (res) => {
        this.stylists = res.filter((s: any) => s.isActive !== false);
        this.isLoadingStylists = false;
      },
      error: () => {
        this.isLoadingStylists = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }

  formatDuration(mins: number): string {
    if (!mins) return '';
    return `${mins} min`;
  }

  getStylistSpecialties(stylist: any): string {
    return stylist.specialty || '';
  }

  getFullStylistSpecialties(stylist: any): string {
    return stylist.fullSpecialties || stylist.specialty || '';
  }

save(): void {
    if (!this.formData.customerId || !this.formData.serviceId || !this.formData.stylistId || !this.formData.date || !this.formData.time) {
      Swal.fire('Faltan datos', 'Por favor complete todos los campos obligatorios.', 'warning');
      return;
    }

    const startDateTime = `${this.formData.date}T${this.formData.time}:00`;

    // Incluimos la propiedad id requerida por el DTO de actualización
    const payload = {
      id: Number(this.formData.id),
      customerId: Number(this.formData.customerId),
      serviceId: Number(this.formData.serviceId),
      stylistId: Number(this.formData.stylistId),
      startTime: startDateTime,
      status: this.formData.status,
      paymentMethod: this.formData.paymentMethod,
      notes: this.formData.notes
    };

    if (this.isEditMode) {
      this.appointmentService.updateAppointment(this.formData.id, payload).subscribe({
        next: () => {
          Swal.fire('¡Actualizada!', 'Cita modificada con éxito.', 'success');
          this.saved.emit();
        },
        error: (err) => {
          Swal.fire('Error', err?.error?.message || 'Error al actualizar la cita.', 'error');
        }
      });
    } else {
      this.appointmentService.createAppointment(payload).subscribe({
        next: () => {
          Swal.fire('¡Guardada!', 'Cita creada con éxito.', 'success');
          this.saved.emit();
        },
        error: (err) => {
          Swal.fire('Error', err?.error?.message || 'Error al crear la cita.', 'error');
        }
      });
    }
  }
}