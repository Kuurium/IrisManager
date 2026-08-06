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

private validateBusinessHours(): string | null {
  if (!this.formData.date || !this.formData.time || !this.formData.serviceId) {
    return null;
  }

  // Asegurar que el ID sea numérico para encontrar el servicio
  const selectedService = this.services.find(s => Number(s.id) === Number(this.formData.serviceId));
  const durationMinutes = Number(selectedService?.durationMinutes || selectedService?.duration || 30);

  const [year, month, day] = this.formData.date.split('-').map(Number);
  // Crear la fecha en UTC/Local exacto para evitar desfases de zona horaria al obtener el día de la semana
  const appointmentDate = new Date(year, month - 1, day);
  const dayOfWeek = appointmentDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  const [hours, minutes] = this.formData.time.split(':').map(Number);
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + durationMinutes;

  let openMinutes = 0;
  let closeMinutes = 0;
  let rangeText = '';

  if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Lunes a Viernes (8:00 AM - 7:00 PM)
    openMinutes = 8 * 60;   // 480 min
    closeMinutes = 19 * 60; // 1140 min
    rangeText = '8:00 AM a 7:00 PM';
  } else if (dayOfWeek === 6) { // Sábado (8:00 AM - 8:00 PM)
    openMinutes = 8 * 60;   // 480 min
    closeMinutes = 20 * 60; // 1200 min
    rangeText = '8:00 AM a 8:00 PM';
  } else if (dayOfWeek === 0) { // Domingo (9:00 AM - 2:00 PM)
    openMinutes = 9 * 60;   // 540 min
    closeMinutes = 14 * 60; // 840 min
    rangeText = '9:00 AM a 2:00 PM';
  }

  console.log({
    dayOfWeek,
    startMinutes,
    endMinutes,
    openMinutes,
    closeMinutes,
    isOutside: startMinutes < openMinutes || endMinutes > closeMinutes
  });

  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
    return `La cita está fuera del horario de atención para ese día (${rangeText}). Por favor selecciona una hora dentro del rango.`;
  }

  return null;
}

  save(): void {
    if (!this.formData.customerId || !this.formData.stylistId || !this.formData.serviceId || !this.formData.date || !this.formData.time) {
      Swal.fire('Formulario incompleto', 'Por favor completa todos los campos requeridos (*).', 'warning');
      return;
    }

    const businessHoursError = this.validateBusinessHours();
    if (businessHoursError) {
      Swal.fire({
        icon: 'warning',
        title: 'Horario no disponible',
        text: businessHoursError,
        confirmButtonColor: '#6f42c1'
      });
      return;
    }

    const [year, month, day] = this.formData.date.split('-').map(Number);
    const [hours, minutes] = this.formData.time.split(':').map(Number);
    
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
            title: 'No se puede agendar',
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
            title: 'No se puede agendar',
            text: translatedMsg,
            confirmButtonColor: '#6f42c1'
          });
        }
      });
    }
  }

  private getTranslatedErrorMessage(err: any): string {
    let rawMsg = '';

    if (typeof err?.error === 'string') {
      rawMsg = err.error;
    } else if (err?.error?.message) {
      rawMsg = err.error.message;
    } else if (err?.message) {
      rawMsg = err.message;
    }

    const lowerMsg = rawMsg.toLowerCase();

    if (lowerMsg.includes('outside business hours')) {
      return 'La cita está fuera del horario de atención del establecimiento. Por favor consulta nuestros horarios de servicio.';
    }

    if (lowerMsg.includes('already booked') || lowerMsg.includes('is already booked')) {
      return 'El estilista ya tiene una cita reservada en este horario. Por favor selecciona otra hora.';
    }

    return rawMsg || 'No se pudo procesar la solicitud. Verifica el horario e intenta de nuevo.';
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