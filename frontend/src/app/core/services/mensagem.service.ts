import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  
  private apiUrl = 'http://localhost:8080/api';
  
  constructor(private authService: AuthService, private http: HttpClient) { }
  
  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }
  
  getMensagens(page: number = 0, size: number = 10, searchTerm?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', 'dataCriacao')
      .set('sortDir', 'desc');
    
    if (searchTerm && searchTerm.trim()) {
      params = params.set('search', searchTerm.trim());
    }
    
    return this.http.get<any>(`${this.apiUrl}/admin/mensagens/paginated`, {
      params,
      headers: this.getAuthHeaders()
    });
  }
  
  enviarMensagem(mensagem: Mensagem): Observable<Mensagem> {
    return this.http.post<Mensagem>(`${this.apiUrl}/contato`, mensagem);
  }
  
  responderMensagem(id: number, resposta: string, adminId: number): Observable<Mensagem> {
    return this.http.put<Mensagem>(`${this.apiUrl}/admin/mensagens/${id}/responder`, { 
      resposta,
      adminId 
    }, {
      headers: this.getAuthHeaders()
    });
  }

  /*responderMensagem(id: number, resposta: string): Observable<Mensagem> {
    return this.http.put<Mensagem>(`${this.apiUrl}/admin/mensagens/${id}/responder`, { resposta });
  }*/
  
  arquivarMensagem(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/admin/mensagens/${id}/arquivar`, {}, {
      headers: this.getAuthHeaders()
    });
  }
  
  deletarMensagem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/mensagens/${id}`, {
      headers: this.getAuthHeaders()
    });
  }


}