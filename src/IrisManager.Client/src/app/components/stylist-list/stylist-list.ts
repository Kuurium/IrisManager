import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StylistService } from '../../core/services/stylist.service';
import { Stylist } from '../../core/models/stylist';
import Swal from 'sweetalert2';
import { StylistFormComponent } from '../stylist-form/stylist-form';

@Component({
  selector: 'app-stylist-list',
  standalone: true,
  imports: [CommonModule, StylistFormComponent],
  templateUrl: './stylist-list.html',
  styleUrl: './stylist-list.scss'
})
export class StylistListComponent implements OnInit {
  private stylistService = inject(StylistService);
  private cdr = inject(ChangeDetectorRef);

  stylists: Stylist[] = [];
  isLoading: boolean = false;

  showModal: boolean = false;
  selectedStylist: Stylist | null = null;

  ngOnInit(): void {
    this.loadStylists();
  }

  

  loadStylists() {
    this.isLoading = true;

    this.stylistService.getStylists().subscribe({
      next: (data) => {
        this.stylists = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar estilistas:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openModal(stylist?: Stylist) {
    console.log('¡Click en Editar!', stylist);
  this.selectedStylist = stylist || null;
  this.showModal = true;
  this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.selectedStylist = null;
    this.cdr.detectChanges();
  }

  onModalSaved() {
    this.closeModal();
    this.loadStylists();
  }

deleteStylist(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El estilista pasará a estado 'Inactivo' y no podrá recibir nuevas citas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stylistService.deleteStylist(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Desactivado!',
              'El estilista ha sido marcado como inactivo exitosamente.',
              'success'
            );
            this.loadStylists(); 
          },
          error: (error) => {
            console.error('Error al intentar desactivar el estilista:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al comunicarse con el servidor.',
              'error'
            );
          }
        });
      }
    });
  }
}