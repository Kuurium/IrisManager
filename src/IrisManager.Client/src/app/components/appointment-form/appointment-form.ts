import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  styleUrls: ['./appointment-form.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentId: number | null = null;
  isEditMode: boolean = false;
  isLoadingStylists: boolean = false;

  customers: any[] = [];
  stylists: any[] = [];
  services: any[] = [];

  formData: any = {
    customerId: null,
    stylistId: null,
    serviceId: null,
    status: 'Scheduled',
    paymentMethod: '',
    notes: '',
    date: '',
    time: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private customerService: CustomerService,
    private stylistService: StylistService,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.appointmentId = +id;
      this.isEditMode = true;
      this.loadAllDataForEdit(this.appointmentId);
    } else {
      this.loadDropdownData();
    }
  }

  loadAllDataForEdit(id: number): void {
    forkJoin({
      customers: this.customerService.getCustomers(),
      services: this.serviceService ? this.serviceService.getServices() : Promise.resolve([])
    }).subscribe({
      next: (res: any) => {
        this.customers = res.customers;
        this.services = res.services;
        this.loadAppointmentData(id);
      },
      error: (err) => console.error('Error al cargar catálogos:', err)
    });
  }

  loadDropdownData(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Error al cargar clientes:', err)
    });

    if (this.serviceService) {
      this.serviceService.getServices().subscribe({
        next: (data) => this.services = data,
        error: (err) => console.error('Error al cargar servicios:', err)
      });
    }
  }

  onServiceChange(resetStylist: boolean = true): void {
    if (resetStylist) {
      this.formData.stylistId = null;
    }

    if (!this.formData.serviceId) {
      this.stylists = [];
      return;
    }

    this.loadStylistsByService(Number(this.formData.serviceId));
  }

  loadStylistsByService(serviceId: number): void {
    this.isLoadingStylists = true;

    const fetchStylists$ = typeof (this.stylistService as any).getStylistsByService === 'function'
      ? (this.stylistService as any).getStylistsByService(serviceId)
      : this.stylistService.getStylists();

    fetchStylists$.subscribe({
      next: (data: any[]) => {
        this.stylists = data || [];
        this.isLoadingStylists = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al filtrar estilistas por servicio:', err);
        this.stylistService.getStylists().subscribe({
          next: (allData) => {
            this.stylists = allData;
            this.isLoadingStylists = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.isLoadingStylists = false;
          }
        });
      }
    });
  }

  loadAppointmentData(id: number): void {
    this.appointmentService.getAppointment(id).subscribe({
      next: (data: any) => {
        let formattedDate = '';
        let formattedTime = '';

        const rawStatus = data.status || data.Status ? String(data.status || data.Status).trim() : '';
        let statusResult = rawStatus;

        if (rawStatus === 'Programada' || rawStatus.toLowerCase() === 'scheduled') {
          statusResult = 'Scheduled';
        } else if (rawStatus === 'Completada' || rawStatus.toLowerCase() === 'completed') {
          statusResult = 'Completed';
        } else if (rawStatus === 'Cancelada' || rawStatus.toLowerCase() === 'cancelled') {
          statusResult = 'Cancelled';
        }

        const rawPayment = data.paymentMethod || data.PaymentMethod ? String(data.paymentMethod || data.PaymentMethod).trim() : '';
        let paymentResult = rawPayment;

        if (rawPayment === 'Tarjeta' || rawPayment.toLowerCase() === 'card') {
          paymentResult = 'Card';
        } else if (rawPayment === 'Efectivo' || rawPayment.toLowerCase() === 'cash') {
          paymentResult = 'Cash';
        } else if (rawPayment === 'Transferencia' || rawPayment.toLowerCase() === 'transfer') {
          paymentResult = 'Transfer';
        } else if (rawPayment === 'Pendiente' || rawPayment.toLowerCase() === 'pending') {
          paymentResult = 'Pending';
        }

        if (data.startTime) {
          const dateObj = new Date(data.startTime);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          formattedDate = `${year}-${month}-${day}`;

          const hours = String(dateObj.getHours()).padStart(2, '0');
          const minutes = String(dateObj.getMinutes()).padStart(2, '0');
          formattedTime = `${hours}:${minutes}`;
        }

        const targetServiceId = data.serviceId ?? data.service?.id ?? null;
        const targetStylistId = data.stylistId ?? data.stylist?.id ?? null;

        this.formData = {
          customerId: data.customerId ?? data.customer?.id ?? null,
          stylistId: targetStylistId,
          serviceId: targetServiceId,
          date: formattedDate,
          time: formattedTime,
          status: statusResult || 'Scheduled',
          paymentMethod: paymentResult || 'Pending',
          notes: data.notes || ''
        };

        if (targetServiceId) {
          this.onServiceChange(false);
        }

        this.cdr.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la cita para editar.', 'error');
        this.router.navigate(['/citas']);
      }
    });
  }

  save(): void {
    if (!this.formData.customerId || !this.formData.stylistId || !this.formData.serviceId || !this.formData.date || !this.formData.time) {
      Swal.fire('Formulario incompleto', 'Por favor completa todos los campos requeridos (*).', 'warning');
      return;
    }

    const [year, month, day] = this.formData.date.split('-').map(Number);
    const [hours, minutes] = this.formData.time.split(':').map(Number);
    
    // Construimos la fecha preservando la zona horaria local exacta ingresada por el usuario
    const pad = (n: number) => String(n).padStart(2, '0');
    const localIsoStartTime = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;

    let paymentValue = this.formData.paymentMethod;
    if (paymentValue === 'Tarjeta' || paymentValue === 'Card') paymentValue = 'Card';
    else if (paymentValue === 'Efectivo' || paymentValue === 'Cash') paymentValue = 'Cash';
    else if (paymentValue === 'Transferencia' || paymentValue === 'Transfer') paymentValue = 'Transfer';
    else if (paymentValue === 'Pendiente' || paymentValue === 'Pending') paymentValue = 'Pending';

    let statusValue = this.formData.status;
    if (statusValue === 'Completada' || statusValue === 'Completed') statusValue = 'Completed';
    else if (statusValue === 'Programada' || statusValue === 'Scheduled') statusValue = 'Scheduled';
    else if (statusValue === 'Cancelada' || statusValue === 'Cancelled') statusValue = 'Cancelled';

    const dto: any = {
      customerId: Number(this.formData.customerId),
      stylistId: Number(this.formData.stylistId),
      serviceId: Number(this.formData.serviceId),
      startTime: localIsoStartTime,
      date: this.formData.date,
      time: this.formData.time,
      status: statusValue || 'Scheduled',
      paymentMethod: paymentValue || 'Pending',
      notes: this.formData.notes || ''
    };

    if (this.isEditMode && this.appointmentId) {
      dto.id = Number(this.appointmentId);
      this.appointmentService.updateAppointment(this.appointmentId, dto).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'La cita ha sido actualizada correctamente.', 'success');
          this.router.navigate(['/citas']);
        },
        error: (err) => {
          console.error('Error del servidor:', err);
          const translatedMsg = this.getTranslatedErrorMessage(err);
          Swal.fire({
            icon: 'warning',
            title: 'Horario ocupado',
            text: translatedMsg,
            confirmButtonColor: '#6f42c1'
          });
        }
      });
    } else {
      this.appointmentService.createAppointment(dto).subscribe({
        next: () => {
          Swal.fire('¡Guardado!', 'La cita ha sido creada correctamente.', 'success');
          this.router.navigate(['/citas']);
        },
        error: (err) => {
          console.error('Error al crear la cita:', err);
          const translatedMsg = this.getTranslatedErrorMessage(err);
          Swal.fire({
            icon: 'warning',
            title: 'Horario ocupado',
            text: translatedMsg,
            confirmButtonColor: '#6f42c1'
          });
        }
      });
    }
  }

  /**
   * Extrae y traduce los mensajes de error devueltos por el backend C#
   */
  private getTranslatedErrorMessage(err: any): string {
    let rawMsg = '';

    if (typeof err?.error === 'string') {
      rawMsg = err.error;
    } else if (err?.error?.message) {
      rawMsg = err.error.message;
    } else if (err?.message) {
      rawMsg = err.message;
    }

    if (rawMsg.toLowerCase().includes('already booked') || rawMsg.toLowerCase().includes('is already booked')) {
      return 'El estilista ya tiene una cita reservada en este horario. Por favor selecciona otra hora.';
    }

    return rawMsg || 'El estilista ya tiene una cita reservada en ese horario. Por favor selecciona otra hora.';
  }

  formatDuration(minutes: number | undefined): string {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }

  getStylistSpecialties(stylist: any): string {
    if (!stylist) return '';
    return stylist.specialties || stylist.specialty || stylist.specialization || '';
  }

  getFullStylistSpecialties(stylist: any): string {
    if (!stylist) return '';
    if (Array.isArray(stylist.fullSpecialties)) {
      return stylist.fullSpecialties.join(' - ');
    }
    return stylist.fullSpecialties || stylist.specialties || stylist.specialty || '';
  }

  goBack(): void {
    this.router.navigate(['/citas']);
  }
}