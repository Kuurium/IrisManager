import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StylistService } from '../../core/services/stylist.service';
import { Stylist, StylistCreateDTO } from '../../core/models/stylist';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stylist-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stylist-form.html',
  styleUrl: './stylist-form.scss'
})
export class StylistFormComponent implements OnChanges { 

  @Input() stylistToEdit: Stylist | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private stylistService = inject(StylistService);
  private cdr = inject(ChangeDetectorRef);

  formData: StylistCreateDTO = { name: '', email: '', phone: '', specialty: '', isActive: true };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stylistToEdit'] && this.stylistToEdit) {
      this.formData = { ...this.stylistToEdit, isActive: (this.stylistToEdit as any).isActive ?? true };
    } else {
      this.resetForm();
    }
  }

  save() {
    if (!this.formData.name || !this.formData.email || !this.formData.phone || !this.formData.specialty) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (this.stylistToEdit && this.stylistToEdit.id) {
      this.stylistService.updateStylist(this.stylistToEdit.id, { id: this.stylistToEdit.id, ...this.formData } as any).subscribe({
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
      this.stylistService.createStylist(this.formData).subscribe({
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
  this.formData = { name: '', email: '', phone: '', specialty: '', isActive: true };
}

  onSubmit() {
  this.save();
}
}