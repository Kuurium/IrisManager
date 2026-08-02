import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerFormComponent {
  @Input() customer: any = { name: '', email: '', phone: '' }; 
  @Output() onSave = new EventEmitter<any>();

  onSubmit() {
    this.onSave.emit(this.customer);
  }
}