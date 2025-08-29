export interface Alumno {
  id: number;
  legajo: string;
  apellido: string;
  nombre: string;
  fechaIngreso: string;
  dni: string;
  correoElectronico: string;
}

export interface AlumnoFormData {
  legajo: string;
  apellido: string;
  nombre: string;
  fechaIngreso: string;
  dni: string;
  correoElectronico: string;
}