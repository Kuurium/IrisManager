import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StylistService } from '../../core/services/stylist.service';
import { ServiceService } from '../../core/services/service.service';
import { Stylist, StylistCreateDTO, StylistUpdateDTO } from '../../core/models/stylist';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stylist-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stylist-form.html',
  styleUrl: './stylist-form.scss'
})
export class StylistFormComponent implements OnInit, OnChanges { 

  @Input() stylistToEdit: Stylist | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private stylistService = inject(StylistService);
  private serviceService = inject(ServiceService);
  private cdr = inject(ChangeDetectorRef);

  availableServices: any[] = [];
  selectedServiceIds: number[] = [];

  formData: StylistCreateDTO = { 
    name: '', 
    email: '', 
    phone: '', 
    isActive: true,
    serviceIds: []
  };

  ngOnInit(): void {
    this.loadServices();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stylistToEdit'] && this.stylistToEdit) {
      this.formData = {
        name: this.stylistToEdit.name,
        email: this.stylistToEdit.email,
        phone: this.stylistToEdit.phone,
        isActive: this.stylistToEdit.isActive ?? true,
        serviceIds: this.stylistToEdit.serviceIds ? [...this.stylistToEdit.serviceIds] : []
      };
      this.selectedServiceIds = this.stylistToEdit.serviceIds ? [...this.stylistToEdit.serviceIds] : [];
    } else {
      this.resetForm();
    }
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.availableServices = services;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar servicios:', err)
    });
  }

  isServiceSelected(serviceId: number): boolean {
    return this.selectedServiceIds.includes(serviceId);
  }

  onServiceToggle(serviceId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!this.selectedServiceIds.includes(serviceId)) {
        this.selectedServiceIds.push(serviceId);
      }
    } else {
      this.selectedServiceIds = this.selectedServiceIds.filter(id => id !== serviceId);
    }
  }

  save() {
    if (!this.formData.name || !this.formData.email || !this.formData.phone || this.selectedServiceIds.length === 0) {
      Swal.fire('Error', 'Todos los campos y al menos un servicio son obligatorios', 'error');
      return;
    }

    if (this.stylistToEdit && this.stylistToEdit.id) {
      const updateDto: StylistUpdateDTO = {
        id: this.stylistToEdit.id,
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        isActive: this.formData.isActive,
        serviceIds: this.selectedServiceIds
      };

      this.stylistService.updateStylist(this.stylistToEdit.id, updateDto).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'Estilista actualizado correctamente.', 'success');
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.cdr.detectChanges();
        }
      });
    } else {
      const createDto: StylistCreateDTO = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        isActive: this.formData.isActive,
        serviceIds: this.selectedServiceIds
      };

      this.stylistService.createStylist(createDto).subscribe({
        next: () => {
          Swal.fire('¡Guardado!', 'Estilista registrado correctamente.', 'success');
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.cdr.detectChanges(); 
        }
      });
    }
  }

  closeModal() { 
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }

  resetForm() {
    this.formData = { name: '', email: '', phone: '', isActive: true, serviceIds: [] };
    this.selectedServiceIds = [];
  }

  onSubmit() {
    this.save();
  }
}