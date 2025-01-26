import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local

        if (token) {
            // Clona la solicitud y agrega el encabezado Authorization
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Token enviado en Authorization:', token);
        }

        return next.handle(request); // Continua con la solicitud
    }
}
