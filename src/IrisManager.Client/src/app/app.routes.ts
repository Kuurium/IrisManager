import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CustomerListComponent } from './components/customer-list/customer-list';
import { CustomerFormComponent } from './components/customer-form/customer-form';
import { StylistListComponent } from './components/stylist-list/stylist-list';
import { AppointmentListComponent } from './components/appointment-list/appointment-list';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clientes', component: CustomerListComponent },
  { path: 'clientes/nuevo', component: CustomerFormComponent },
  { path: 'clientes/editar/:id', component: CustomerFormComponent },
  { path: 'estilistas', component: StylistListComponent }, 
  { path: 'citas', component: AppointmentListComponent },
  { path: 'citas/nueva', component: AppointmentFormComponent },
  { path: 'citas/editar/:id', component: AppointmentFormComponent }
];