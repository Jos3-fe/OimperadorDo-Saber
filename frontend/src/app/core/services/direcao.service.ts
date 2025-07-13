import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DirecaoDTO } from '../models/direcao';

@Injectable({
  providedIn: 'root'
})
export class DirecaoService {
  private apiUrl = 'http://localhost:8080/api/direcao';

  constructor(private authService: AuthService, private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Público - Listar todos
   getTodosDirecao(): Observable<DirecaoDTO[]> {
    return this.http.get<DirecaoDTO[]>(this.apiUrl);
  }

  getAllDirecao(): Observable<DirecaoDTO[]> {
    return this.http.get<DirecaoDTO[]>(this.apiUrl, {
        headers: this.getAuthHeaders()
      });
  }

  // Público - Buscar por ID
  getDirecaoById(id: number): Observable<DirecaoDTO> {
    return this.http.get<DirecaoDTO>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders()
      });
  }

  // Admin - Criar membro com imagem
  createDirecao(
    nome: string, 
    cargo: string, 
    detalhes: string | null, 
    imagem: File | null
  ): Observable<DirecaoDTO> {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cargo', cargo);
    if (detalhes) formData.append('detalhes', detalhes);
    if (imagem) formData.append('imagem', imagem);

    return this.http.post<DirecaoDTO>(`${this.apiUrl}/admin`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Atualizar membro com imagem
  updateDirecao(
    id: number,
    nome: string,
    cargo: string,
    detalhes: string | null,
    imagem: File | null,
    manterImagem: boolean = true
  ): Observable<DirecaoDTO> {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cargo', cargo);
    if (detalhes) formData.append('detalhes', detalhes);
    if (imagem) formData.append('imagem', imagem);
    formData.append('manterImagem', manterImagem.toString());

    return this.http.put<DirecaoDTO>(`${this.apiUrl}/admin/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Deletar membro
  deleteDirecao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Upload apenas de imagem
  uploadImage(imagem: File): Observable<string> {
    const formData = new FormData();
    formData.append('imagem', imagem);

    return this.http.post<string>(`${this.apiUrl}/admin/upload-image`, formData, {
      headers: this.getAuthHeaders()
    });
  }
}