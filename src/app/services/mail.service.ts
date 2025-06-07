import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private apiUrl = environment.apiUrl + 'contacto'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  enviarCorreo(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
