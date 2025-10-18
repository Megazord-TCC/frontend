import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      console.group('🔴 Erro HTTP Interceptado');
      console.error('URL:', error.url);
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('Método:', req.method);

      if (error.error) {
        console.error('Body do erro:', error.error);

        // Se for um erro 400 com validações
        if (error.status === 400 && error.error.errors) {
          console.group('📝 Detalhes de Validação:');
          error.error.errors.forEach((validationError: any, index: number) => {
            console.error(`Erro ${index + 1}:`, {
              campo: validationError.field,
              valorRejeitado: validationError.rejectedValue,
              mensagem: validationError.defaultMessage,
              codigo: validationError.code
            });
          });
          console.groupEnd();
        }
      }

      console.groupEnd();

      // Re-throw o erro para que o componente possa tratá-lo
      return throwError(() => error);
    })
  );
};
