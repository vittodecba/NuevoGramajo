import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Alumno, AlumnoFormData } from '../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private alumnos: Alumno[] = [
    {
      id: 1,
      legajo: 'EST001',
      apellido: 'García',
      nombre: 'María Elena',
      fechaIngreso: '2023-03-15',
      dni: '12345678',
      correoElectronico: 'maria.garcia@email.com'
    },
    {
      id: 2,
      legajo: 'EST002',
      apellido: 'Rodríguez',
      nombre: 'Juan Carlos',
      fechaIngreso: '2023-04-20',
      dni: '23456789',
      correoElectronico: 'juan.rodriguez@email.com'
    },
    {
      id: 3,
      legajo: 'EST003',
      apellido: 'López',
      nombre: 'Ana Sofía',
      fechaIngreso: '2023-02-10',
      dni: '34567890',
      correoElectronico: 'ana.lopez@email.com'
    },
    {
      id: 4,
      legajo: 'EST004',
      apellido: 'Martínez',
      nombre: 'Pedro Luis',
      fechaIngreso: '2023-05-08',
      dni: '45678901',
      correoElectronico: 'pedro.martinez@email.com'
    },
    {
      id: 5,
      legajo: 'EST005',
      apellido: 'Fernández',
      nombre: 'Laura Isabel',
      fechaIngreso: '2023-01-25',
      dni: '56789012',
      correoElectronico: 'laura.fernandez@email.com'
    }
  ];

  private alumnosSubject = new BehaviorSubject<Alumno[]>(this.alumnos);

  constructor() {}

  getAlumnos(): Observable<Alumno[]> {
    return this.alumnosSubject.asObservable().pipe(delay(300));
  }

  getAlumnoById(id: number): Observable<Alumno | undefined> {
    return of(this.alumnos.find(alumno => alumno.id === id)).pipe(delay(200));
  }

  createAlumno(alumnoData: AlumnoFormData): Observable<Alumno> {
    const newId = Math.max(...this.alumnos.map(a => a.id)) + 1;
    const newAlumno: Alumno = {
      id: newId,
      ...alumnoData
    };
    
    this.alumnos.push(newAlumno);
    this.alumnosSubject.next([...this.alumnos]);
    
    return of(newAlumno).pipe(delay(400));
  }

  updateAlumno(id: number, alumnoData: AlumnoFormData): Observable<Alumno> {
    const index = this.alumnos.findIndex(alumno => alumno.id === id);
    if (index !== -1) {
      this.alumnos[index] = { id, ...alumnoData };
      this.alumnosSubject.next([...this.alumnos]);
    }
    
    return of(this.alumnos[index]).pipe(delay(400));
  }

  deleteAlumno(id: number): Observable<boolean> {
    const index = this.alumnos.findIndex(alumno => alumno.id === id);
    if (index !== -1) {
      this.alumnos.splice(index, 1);
      this.alumnosSubject.next([...this.alumnos]);
      return of(true).pipe(delay(300));
    }
    
    return of(false);
  }

  filterAlumnos(legajo?: string, fechaInicio?: string, fechaFin?: string): Observable<Alumno[]> {
    return this.getAlumnos().pipe(
      map(alumnos => {
        let filteredAlumnos = [...alumnos];

        if (legajo) {
          filteredAlumnos = filteredAlumnos.filter(alumno => 
            alumno.legajo.toLowerCase().includes(legajo.toLowerCase())
          );
        }

        if (fechaInicio) {
          filteredAlumnos = filteredAlumnos.filter(alumno => 
            new Date(alumno.fechaIngreso) >= new Date(fechaInicio)
          );
        }

        if (fechaFin) {
          filteredAlumnos = filteredAlumnos.filter(alumno => 
            new Date(alumno.fechaIngreso) <= new Date(fechaFin)
          );
        }

        return filteredAlumnos;
      })
    );
  }
}