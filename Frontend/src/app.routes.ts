import { Routes } from '@angular/router';
import { AlumnoListComponent } from './components/alumno-list.component';
import { AlumnoFormComponent } from './components/alumno-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/alumnos', pathMatch: 'full' },
  { path: 'alumnos', component: AlumnoListComponent },
  { path: 'alumno/nuevo', component: AlumnoFormComponent },
  { path: 'alumno/editar/:id', component: AlumnoFormComponent },
  { path: '**', redirectTo: '/alumnos' }
];