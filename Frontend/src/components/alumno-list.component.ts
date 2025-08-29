import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AlumnoService } from '../services/alumno.service';
import { Alumno } from '../models/alumno.model';

type SortColumn = 'legajo' | 'apellido' | 'nombre' | 'fechaIngreso' | 'dni' | 'correoElectronico';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Gestión de Alumnos</h1>
        <button 
          class="btn-primary" 
          [routerLink]="['/alumno/nuevo']">
          ➕ Nuevo Alumno
        </button>
      </div>

      <div class="filters-section">
        <h3>Filtros</h3>
        <div class="filters-grid">
          <div class="filter-group">
            <label for="legajoFilter">Filtrar por Legajo:</label>
            <input
              id="legajoFilter"
              type="text"
              [(ngModel)]="filtroLegajo"
             (ngModelChange)="onFiltroChange()"
              placeholder="Ej: EST001"
              class="filter-input">
          </div>

          <div class="filter-group">
            <label for="fechaInicio">Fecha Ingreso Desde:</label>
            <input
              id="fechaInicio"
              type="date"
              [(ngModel)]="filtroFechaInicio"
             (ngModelChange)="onFiltroChange()"
              class="filter-input">
          </div>

          <div class="filter-group">
            <label for="fechaFin">Fecha Ingreso Hasta:</label>
            <input
              id="fechaFin"
              type="date"
              [(ngModel)]="filtroFechaFin"
             (ngModelChange)="onFiltroChange()"
              class="filter-input">
          </div>

          <div class="filter-group">
            <button class="btn-secondary" (click)="limpiarFiltros()">
              🗑️ Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <div class="results-info">
        <p><strong>{{alumnosFiltrados.length}}</strong> alumno(s) encontrado(s)</p>
      </div>

      <div class="loading" *ngIf="isLoading">
        <p>Cargando alumnos...</p>
      </div>

     <div class="table-container" *ngIf="!isLoading && alumnosFiltrados.length > 0">
       <table class="alumnos-table">
         <thead>
           <tr>
             <th class="sortable" (click)="ordenarPor('legajo')">
               Legajo
               <span class="sort-indicator" [class.active]="sortColumn === 'legajo'">
                 <span [class.asc]="sortDirection === 'asc'" [class.desc]="sortDirection === 'desc'">
                   {{ sortColumn === 'legajo' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
                 </span>
               </span>
             </th>
             <th class="sortable" (click)="ordenarPor('apellido')">
               Apellido
               <span class="sort-indicator" [class.active]="sortColumn === 'apellido'">
                 <span [class.asc]="sortDirection === 'asc'" [class.desc]="sortDirection === 'desc'">
                   {{ sortColumn === 'apellido' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
                 </span>
               </span>
             </th>
             <th class="sortable" (click)="ordenarPor('nombre')">
               Nombre
               <span class="sort-indicator" [class.active]="sortColumn === 'nombre'">
                 <span [class.asc]="sortDirection === 'asc'" [class.desc]="sortDirection === 'desc'">
                   {{ sortColumn === 'nombre' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
                 </span>
               </span>
             </th>
             <th class="sortable" (click)="ordenarPor('fechaIngreso')">
               Fecha Ingreso
               <span class="sort-indicator" [class.active]="sortColumn === 'fechaIngreso'">
                 <span [class.asc]="sortDirection === 'asc'" [class.desc]="sortDirection === 'desc'">
                   {{ sortColumn === 'fechaIngreso' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
                 </span>
               </span>
             </th>
             <th class="sortable" (click)="ordenarPor('dni')">
               DNI
               <span class="sort-indicator" [class.active]="sortColumn === 'dni'">
                 <span [class.asc]="sortDirection === 'asc'" [class.desc]="sortDirection === 'desc'">
                   {{ sortColumn === 'dni' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
                 </span>
               </span>
             </th>
             <th class="sortable" (click)="ordenarPor('correoElectronico')">
               Correo Electrónico
               <span class="sort-indicator" [class.active]="sortColumn === 'correoElectronico'">
                 <span [class.asc]="sortDirection === 'asc'" [class.desc]="sortDirection === 'desc'">
                   {{ sortColumn === 'correoElectronico' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕' }}
                 </span>
               </span>
             </th>
             <th class="actions-column">Acciones</th>
           </tr>
         </thead>
         <tbody>
           <tr *ngFor="let alumno of alumnosFiltrados; trackBy: trackByAlumno" class="alumno-row">
             <td class="legajo-cell">{{alumno.legajo}}</td>
             <td class="apellido-cell">{{alumno.apellido}}</td>
             <td class="nombre-cell">{{alumno.nombre}}</td>
             <td class="fecha-cell">{{formatearFecha(alumno.fechaIngreso)}}</td>
             <td class="dni-cell">{{alumno.dni}}</td>
             <td class="email-cell">{{alumno.correoElectronico}}</td>
             <td class="actions-cell">
               <div class="action-buttons">
                 <button 
                   class="btn-edit"
                   [routerLink]="['/alumno/editar', alumno.id]"
                   title="Editar alumno">
                   ✏️
                 </button>
                 <button 
                   class="btn-delete"
                   (click)="eliminarAlumno(alumno)"
                   title="Eliminar alumno">
                   🗑️
                 </button>
               </div>
             </td>
           </tr>
         </tbody>
       </table>
     </div>

      <div class="empty-state" *ngIf="!isLoading && alumnosFiltrados.length === 0">
        <h3>No se encontraron alumnos</h3>
        <p>Intenta ajustar los filtros o crear un nuevo alumno.</p>
        <button 
          class="btn-primary" 
          [routerLink]="['/alumno/nuevo']">
          ➕ Crear Primer Alumno
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h1 {
      color: #1e293b;
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    }

    .filters-section h3 {
      margin: 0 0 1rem 0;
      color: #374151;
      font-size: 1.25rem;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .filter-input {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      background: white;
    }

    .filter-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .results-info {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .results-info p {
      margin: 0;
      color: #0c4a6e;
      font-size: 1rem;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
      font-size: 1.125rem;
    }

   .table-container {
     background: white;
     border-radius: 12px;
     box-shadow: 0 4px 20px rgba(0,0,0,0.1);
     overflow: hidden;
     margin-bottom: 1.5rem;
   }

   .alumnos-table {
     width: 100%;
     border-collapse: collapse;
     font-size: 0.875rem;
   }

   .alumnos-table thead {
     background: linear-gradient(135deg, #2563eb, #3b82f6);
     color: white;
   }

   .alumnos-table th {
     padding: 1rem 0.75rem;
     text-align: left;
     font-weight: 600;
     font-size: 0.875rem;
     letter-spacing: 0.025em;
     text-transform: uppercase;
     position: relative;
   }

   .alumnos-table th.sortable {
     cursor: pointer;
     user-select: none;
     transition: background-color 0.2s;
   }

   .alumnos-table th.sortable:hover {
     background: rgba(255,255,255,0.1);
   }

   .sort-indicator {
     margin-left: 0.5rem;
     font-size: 0.75rem;
     opacity: 0.7;
     transition: opacity 0.2s;
   }

   .sort-indicator.active {
     opacity: 1;
     font-weight: bold;
   }

   .alumnos-table td {
     padding: 1rem 0.75rem;
     border-bottom: 1px solid #f1f5f9;
     vertical-align: middle;
   }

   .alumno-row {
     transition: background-color 0.2s;
   }

   .alumno-row:hover {
     background-color: #f8fafc;
   }

   .legajo-cell {
     font-weight: 600;
     color: #2563eb;
   }

   .apellido-cell, .nombre-cell {
     font-weight: 500;
     color: #1e293b;
   }

   .fecha-cell {
     color: #6b7280;
     font-family: 'Courier New', monospace;
   }

   .dni-cell {
     color: #374151;
     font-family: 'Courier New', monospace;
   }

   .email-cell {
     color: #4b5563;
     max-width: 200px;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
   }

   .actions-column {
     width: 120px;
     text-align: center;
   }

   .actions-cell {
     text-align: center;
   }

   .action-buttons {
     display: flex;
     gap: 0.5rem;
     justify-content: center;
   }

   .btn-edit, .btn-delete {
     width: 32px;
     height: 32px;
     border: none;
     border-radius: 6px;
     cursor: pointer;
     transition: all 0.2s;
     font-size: 0.875rem;
     display: flex;
     align-items: center;
     justify-content: center;
   }

   .btn-edit {
     background: #f59e0b;
     color: white;
   }

   .btn-edit:hover {
     background: #d97706;
     transform: scale(1.1);
   }

   .btn-delete {
     background: #ef4444;
     color: white;
   }

   .btn-delete:hover {
     background: #dc2626;
     transform: scale(1.1);
   }

    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-secondary:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .empty-state h3 {
      color: #374151;
      margin-bottom: 0.75rem;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 2rem;
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

     .table-container {
       overflow-x: auto;
     }

     .alumnos-table {
       min-width: 800px;
     }

     .alumnos-table th,
     .alumnos-table td {
       padding: 0.75rem 0.5rem;
       font-size: 0.8rem;
     }

     .email-cell {
       max-width: 150px;
     }
    }
  `]
})
export class AlumnoListComponent implements OnInit, OnDestroy {
  alumnos: Alumno[] = [];
  alumnosFiltrados: Alumno[] = [];
  isLoading = true;
  
  filtroLegajo = '';
  filtroFechaInicio = '';
  filtroFechaFin = '';
  
 sortColumn: SortColumn = 'apellido';
 sortDirection: SortDirection = 'asc';
 
  private destroy$ = new Subject<void>();
  private filtroSubject = new Subject<void>();

  constructor(
    private alumnoService: AlumnoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
    this.setupFiltros();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFiltros(): void {
    this.filtroSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.aplicarFiltros();
    });
  }

  cargarAlumnos(): void {
    this.isLoading = true;
    this.alumnoService.getAlumnos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (alumnos) => {
          this.alumnos = alumnos;
         this.aplicarFiltrosYOrdenamiento();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar alumnos:', error);
          this.isLoading = false;
        }
      });
  }

 private aplicarFiltrosYOrdenamiento(): void {
   this.alumnoService.filterAlumnos(
     this.filtroLegajo,
     this.filtroFechaInicio,
     this.filtroFechaFin
   ).pipe(takeUntil(this.destroy$))
   .subscribe(alumnos => {
     this.alumnosFiltrados = this.ordenarAlumnos(alumnos);
   });
 }
  aplicarFiltros(): void {
   this.aplicarFiltrosYOrdenamiento();
  }

  onFiltroChange(): void {
    this.filtroSubject.next();
  }

  limpiarFiltros(): void {
    this.filtroLegajo = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
   this.aplicarFiltrosYOrdenamiento();
  }
 ordenarPor(column: SortColumn): void {
   if (this.sortColumn === column) {
     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
   } else {
     this.sortColumn = column;
     this.sortDirection = 'asc';
   }
   this.alumnosFiltrados = this.ordenarAlumnos(this.alumnosFiltrados);
 }

 private ordenarAlumnos(alumnos: Alumno[]): Alumno[] {
   return [...alumnos].sort((a, b) => {
     let valueA: string | number;
     let valueB: string | number;

     switch (this.sortColumn) {
       case 'fechaIngreso':
         valueA = new Date(a[this.sortColumn]).getTime();
         valueB = new Date(b[this.sortColumn]).getTime();
         break;
       default:
         valueA = a[this.sortColumn].toLowerCase();
         valueB = b[this.sortColumn].toLowerCase();
     }

     if (valueA < valueB) {
       return this.sortDirection === 'asc' ? -1 : 1;
     }
     if (valueA > valueB) {
       return this.sortDirection === 'asc' ? 1 : -1;
     }
     return 0;
   });
 }

 trackByAlumno(index: number, alumno: Alumno): number {
   return alumno.id;
 }

  eliminarAlumno(alumno: Alumno): void {
    const confirmacion = confirm(
      `¿Está seguro que desea eliminar al alumno ${alumno.nombre} ${alumno.apellido}?`
    );
    
    if (confirmacion) {
      this.alumnoService.deleteAlumno(alumno.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.cargarAlumnos();
            }
          },
          error: (error) => {
            console.error('Error al eliminar alumno:', error);
            alert('Error al eliminar el alumno. Intente nuevamente.');
          }
        });
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}