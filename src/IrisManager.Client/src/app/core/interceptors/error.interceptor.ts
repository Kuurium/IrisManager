import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado al procesar tu solicitud.';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente o de red
        errorMessage = `Error de red: ${error.error.message}`;
      } else {
        // Error del lado del servidor (.NET)
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica que tu API esté en ejecución.';
        } else if (error.status === 400) {
          errorMessage = 'Datos incorrectos. Verifica la información enviada (Error 400).';
        } else if (error.status === 404) {
          errorMessage = 'El recurso solicitado no existe (Error 404).';
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, intenta más tarde (Error 500).';
        } else {
          errorMessage = `Error del servidor: Código ${error.status}`;
        }
      }

      Swal.fire({
        icon: 'error',
        title: '¡Problema de Conexión!',
        text: errorMessage,
        confirmButtonColor: '#0d6efd',
        allowOutsideClick: false
      });

      return throwError(() => error);
    })
  );
};