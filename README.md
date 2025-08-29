# POC-FullStack
Proyecto para ejecutar el ABM de Alumnos como prueba de concepto para integrar Front y Back

# Generacion de proyecto en Angular

## PROMPT
quiero que te pongas en el rol de un experto en programacion en angular y me crees un sistema que tengo una vista donde pueda listar alumnos. Es mandatorio que esta vista se presente en formato tabla. De los alumnos me interesa mostrar su legajo, apellido y nombre, fecha de ingreso, dni, correo electronico. Esta vista tiene que permitirme ademas poder crear, modificar o eliminar alumnos, y ademas permitirme filtrarlos por fecha de ingreso, o por legajo. Como parte del proyecto, quiero que me crees tambien los servicios necesarios para poder consumir una api desde donde voy a obtener esta informacion, pero que inicialmente me proporciones valores estaticos en estos servicios para poder visualizar la informacion.

# Como ejecutar el proyecto

## Frontend

1. Se requiere tener instalado node.js. Si no lo tiene, ingresar a la pagina oficial de node.js y descargar la ultima version LTS (Long Term Support). Una mejor recomendacion es obtener NVM (Node Version Manager) para poder hacer uso de diferentes versiones de node.js.
2. Instalar node.js. Para verificar que haya quedado correctamente instalado ejecutando el comando **node -v** y posteriormente **npm -v**
3. Instalar Angular Cli ejecutando el siguiente comando **npm install -g @angular/cli**. Para verificar que haya quedado correctamente instalado, ejecutamos el comando **ng version**
4. Acceder a la carpeta del proyecto y ejecutar el comando **npm install**
5. Ejecutar el proyecto mediante el comando **ng serve** y posteriormente accedemos a la URL http://localhost:4200

## Backend

1. Abrir el proyecto ingresando a la carpeta backend y ejecutando la solucion (archivo con extension .sln)
2. Restaurar los packetes Nugets del proyecto y realizar un Rebuild del proyecto.
3. Configurar la conexion a la base de datos. Si estamos utilizando SQL Server, MySQL, MariaDB o Postgree, asegurarse de ejecutar las migraciones correspondientes con EF.
