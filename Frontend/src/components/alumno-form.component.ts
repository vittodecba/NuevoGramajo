import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AlumnoService } from '../services/alumno.service';
import { AlumnoFormData } from '../models/alumno.model';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>{{ isEditing ? 'Editar' : 'Nuevo' }} Alumno</h1>
        <button 
          class="btn-secondary" 
          (click)="volver()">
          ← Volver
        </button>
      </div>

      <div class="form-container">
        <form [formGroup]="alumnoForm" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
          <div class="form-grid">
            <div class="form-group">
              <label for="legajo">Legajo *</label>
              <input
                id="legajo"
                type="text"
                formControlName="legajo"
                class="form-input"
                [class.error]="isFieldInvalid('legajo')"
                placeholder="Ej: EST001">
              <div class="error-message" *ngIf="isFieldInvalid('legajo')">
                <span *ngIf="alumnoForm.get('legajo')?.errors?.['required']">
                  El legajo es obligatorio
                </span>
                <span *ngIf="alumnoForm.get('legajo')?.errors?.['minlength']">
                  El legajo debe tener al menos 3 caracteres
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="apellido">Apellido *</label>
              <input
                id="apellido"
                type="text"
                formControlName="apellido"
                class="form-input"
                [class.error]="isFieldInvalid('apellido')"
                placeholder="Apellido del alumno">
              <div class="error-message" *ngIf="isFieldInvalid('apellido')">
                <span *ngIf="alumnoForm.get('apellido')?.errors?.['required']">
                  El apellido es obligatorio
                </span>
                <span *ngIf="alumnoForm.get('apellido')?.errors?.['minlength']">
                  El apellido debe tener al menos 2 caracteres
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                formControlName="nombre"
                class="form-input"
                [class.error]="isFieldInvalid('nombre')"
                placeholder="Nombre del alumno">
              <div class="error-message" *ngIf="isFieldInvalid('nombre')">
                <span *ngIf="alumnoForm.get('nombre')?.errors?.['required']">
                  El nombre es obligatorio
                </span>
                <span *ngIf="alumnoForm.get('nombre')?.errors?.['minlength']">
                  El nombre debe tener al menos 2 caracteres
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="fechaIngreso">Fecha de Ingreso *</label>
              <input
                id="fechaIngreso"
                type="date"
                formControlName="fechaIngreso"
                class="form-input"
                [class.error]="isFieldInvalid('fechaIngreso')">
              <div class="error-message" *ngIf="isFieldInvalid('fechaIngreso')">
                <span *ngIf="alumnoForm.get('fechaIngreso')?.errors?.['required']">
                  La fecha de ingreso es obligatoria
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="dni">DNI *</label>
              <input
                id="dni"
                type="text"
                formControlName="dni"
                class="form-input"
                [class.error]="isFieldInvalid('dni')"
                placeholder="12345678">
              <div class="error-message" *ngIf="isFieldInvalid('dni')">
                <span *ngIf="alumnoForm.get('dni')?.errors?.['required']">
                  El DNI es obligatorio
                </span>
                <span *ngIf="alumnoForm.get('dni')?.errors?.['pattern']">
                  El DNI debe contener solo números (7-8 dígitos)
                </span>
              </div>
            </div>

            <div class="form-group full-width">
              <label for="correoElectronico">Correo Electrónico *</label>
              <input
                id="correoElectronico"
                type="email"
                formControlName="correoElectronico"
                class="form-input"
                [class.error]="isFieldInvalid('correoElectronico')"
                placeholder="alumno@email.com">
              <div class="error-message" *ngIf="isFieldInvalid('correoElectronico')">
                <span *ngIf="alumnoForm.get('correoElectronico')?.errors?.['required']">
                  El correo electrónico es obligatorio
                </span>
                <span *ngIf="alumnoForm.get('correoElectronico')?.errors?.['email']">
                  Ingrese un correo electrónico válido
                </span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn-cancel"
              (click)="volver()">
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="alumnoForm.invalid || isSubmitting">
              <span *ngIf="isSubmitting">Guardando...</span>
              <span *ngIf="!isSubmitting">
                {{ isEditing ? '✏️ Actualizar' : '➕ Crear' }} Alumno
              </span>
            </button>
          </div>
        </form>

        <div class="loading" *ngIf="isLoading">
          <p>Cargando información del alumno...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
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

    .form-container {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input {
      padding: 0.875rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
      background-color: #fef2f2;
    }

    .form-input.error:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .error-message {
      margin-top: 0.5rem;
      color: #ef4444;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
      border: none;
      padding: 0.875rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }

    .btn-cancel {
      background: transparent;
      color: #6b7280;
      border: 2px solid #d1d5db;
      padding: 0.875rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #f9fafb;
      border-color: #9ca3af;
      color: #374151;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
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

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-primary, .btn-cancel {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AlumnoFormComponent implements OnInit, OnDestroy {
  alumnoForm: FormGroup;
  isEditing = false;
  isLoading = false;
  isSubmitting = false;
  alumnoId: number | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.alumnoForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.alumnoId = +params['id'];
        this.isEditing = true;
        this.loadAlumno();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      legajo: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      fechaIngreso: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });
  }

  private loadAlumno(): void {
    if (!this.alumnoId) return;
    
    this.isLoading = true;
    this.alumnoService.getAlumnoById(this.alumnoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (alumno) => {
          if (alumno) {
            this.alumnoForm.patchValue({
              legajo: alumno.legajo,
              apellido: alumno.apellido,
              nombre: alumno.nombre,
              fechaIngreso: alumno.fechaIngreso,
              dni: alumno.dni,
              correoElectronico: alumno.correoElectronico
            });
          } else {
            this.router.navigate(['/alumnos']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar alumno:', error);
          this.isLoading = false;
          this.router.navigate(['/alumnos']);
        }
      });
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      this.isSubmitting = true;
      const formData: AlumnoFormData = this.alumnoForm.value;
      
      const operation = this.isEditing && this.alumnoId
        ? this.alumnoService.updateAlumno(this.alumnoId, formData)
        : this.alumnoService.createAlumno(formData);

      operation.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['/alumnos']);
          },
          error: (error) => {
            console.error('Error al guardar alumno:', error);
            this.isSubmitting = false;
            alert('Error al guardar el alumno. Intente nuevamente.');
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.alumnoForm.controls).forEach(key => {
      this.alumnoForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.alumnoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  volver(): void {
    this.router.navigate(['/alumnos']);
  }
}