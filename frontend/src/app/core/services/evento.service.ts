import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { EventoDTO } from '../models/EventoDTO';
import { environment } from '../models/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  

  constructor(private authService: AuthService, private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Público - Listar eventos paginados
  getEventosPaginated(
    page: number = 0, 
    size: number = 10, 
    sortBy: string = 'dataEvento', 
    sortDir: string = 'asc'
  ): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    };
    
    return this.http.get<any>(`${environment.apiUrl}/paginated`, { params });
  }

  // Público - Buscar por ID
  getEventoById(id: number): Observable<EventoDTO> {
    return this.http.get<EventoDTO>(`${environment.apiUrl}/${id}`);
  }

  // Admin - Listar todos
  getAllEventosAdmin(): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${environment.apiUrl}/admin/all`, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Criar evento com imagem
  createEvento(
    titulo: string,
    descricao: string | null,
    descricaoDetalhada: string | null,
    dataEvento: string,
    dataFim: string | null,
    local: string | null,
    preco: number,
    imagem: File | null
  ): Observable<EventoDTO> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    if (descricao) formData.append('descricao', descricao);
    if (descricaoDetalhada) formData.append('descricaoDetalhada', descricaoDetalhada);
    formData.append('dataEvento', dataEvento);
    if (dataFim) formData.append('dataFim', dataFim);
    if (local) formData.append('local', local);
    formData.append('preco', preco.toString());
    if (imagem) formData.append('imagem', imagem);

    return this.http.post<EventoDTO>(`${environment.apiUrl}/admin`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Atualizar evento com imagem
  updateEvento(
    id: number,
    titulo: string,
    descricao: string | null,
    descricaoDetalhada: string | null,
    dataEvento: string,
    dataFim: string | null,
    local: string | null,
    preco: number,
    imagem: File | null,
    manterImagem: boolean = true
  ): Observable<EventoDTO> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    if (descricao) formData.append('descricao', descricao);
    if (descricaoDetalhada) formData.append('descricaoDetalhada', descricaoDetalhada);
    formData.append('dataEvento', dataEvento);
    if (dataFim) formData.append('dataFim', dataFim);
    if (local) formData.append('local', local);
    formData.append('preco', preco.toString());
    if (imagem) formData.append('imagem', imagem);
    formData.append('manterImagem', manterImagem.toString());

    return this.http.put<EventoDTO>(`${environment.apiUrl}/admin/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Deletar evento
  deleteEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Upload apenas de imagem
  uploadImage(imagem: File): Observable<string> {
    const formData = new FormData();
    formData.append('imagem', imagem);

    return this.http.post<string>(`${environment.apiUrl}/admin/upload-image`, formData, {
      headers: this.getAuthHeaders()
    });
  }
}