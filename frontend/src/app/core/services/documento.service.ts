import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DocumentoDTO } from '../models/documento';
import { environment } from '../models/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  

  constructor(private authService: AuthService, private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Listar documentos paginados
  getDocumentosPaginated(page: number = 0, size: number = 10, sortBy: string = 'dataUpload', sortDir: string = 'desc'): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    };
    
    return this.http.get<any>(`${environment.apiUrl}/paginated`, { 
      params,
      headers: this.getAuthHeaders()
    });
  }


  // Público - Listar galerias paginadas
  getDocumentosPaginatedPublico(
    page: number = 0, size: number = 10, sortBy: string = 'dataUpload', sortDir: string = 'desc'): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    };
    
    return this.http.get<any>(`${environment.apiUrl}/paginated`, { params });
  }


  // Upload de documento
  uploadDocumento(file: File, adminId: number, descricao?: string): Observable<DocumentoDTO> {
    const formData = new FormData();
    formData.append('file', file);
    if (descricao) formData.append('descricao', descricao);
    
    const headers = this.getAuthHeaders()
      .set('admin-id', adminId.toString());

    return this.http.post<DocumentoDTO>(`${environment.apiUrl}/admin/upload`, formData, { 
      headers 
    });
  }

  // Deletar documento
  deleteDocumento(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // MÉTODO CORRIGIDO - Download de documento
  downloadDocumento(documentoId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/download/${documentoId}`, {
      responseType: 'blob',
      headers: this.getAuthHeaders() 
    });
  }
 
}