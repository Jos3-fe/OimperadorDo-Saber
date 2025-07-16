import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GaleriaDTO } from '../models/GaleriaDTO';
import { environment } from '../models/environment';

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  

  constructor(private authService: AuthService, private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Público - Listar galerias paginadas
  getGaleriasPaginated(
    page: number = 0,
    size: number = 12, 
    sortBy: string = 'dataPublicacao', 
    sortDir: string = 'desc'
  ): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    };
    
    return this.http.get<any>(`${environment.apiUrl}/galeria/paginated`, { params });
  }

  // Público - Buscar por ID
  getGaleriaById(id: number): Observable<GaleriaDTO> {
    return this.http.get<GaleriaDTO>(`${environment.apiUrl}/${id}`);
  }

  // Público - Buscar por slug
  getGaleriaBySlug(slug: string): Observable<GaleriaDTO> {
    return this.http.get<GaleriaDTO>(`${environment.apiUrl}/galeria/slug/${slug}`);
  }

  // Público - Buscar por ano letivo
  getGaleriasByAno(anoLetivo: string): Observable<GaleriaDTO[]> {
    return this.http.get<GaleriaDTO[]>(`${environment.apiUrl}/galeria/ano/${anoLetivo}`);
  }

  // Público - Buscar por ano letivo paginado
  getGaleriasByAnoPaginated(
    anoLetivo: string,
    page: number = 0,
    size: number = 12
  ): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    
    return this.http.get<any>(`${environment.apiUrl}/galeria/ano/${anoLetivo}/paginated`, { params });
  }

  // Público - Buscar por tag
  getGaleriasByTag(tag: string): Observable<GaleriaDTO[]> {
    return this.http.get<GaleriaDTO[]>(`${environment.apiUrl}/galeria/tag/${tag}`);
  }

  // Público - Buscar por título
  searchGalerias(titulo: string, page: number = 0, size: number = 12): Observable<any> {
    const params = {
      titulo,
      page: page.toString(),
      size: size.toString()
    };
    
    return this.http.get<any>(`${environment.apiUrl}/galeria/search`, { params });
  }

  // Público - Obter anos letivos disponíveis
  getAnosLetivos(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/galeria/anos-letivos`);
  }

  // Público - Obter tags disponíveis
  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/galeria/tags`);
  }

  // Admin - Criar galeria com múltiplas imagens
  createGaleria(
    titulo: string,
    conteudo: string | null,
    anoLetivo: string | null,
    dataPublicacao: Date | null,
    tags: string[] | null,
    imagens: File[] | null
  ): Observable<GaleriaDTO> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    if (conteudo) formData.append('conteudo', conteudo);
    if (anoLetivo) formData.append('anoLetivo', anoLetivo);
    if (dataPublicacao) {
      formData.append('dataPublicacao', dataPublicacao.toISOString().split('T')[0]);
    }
    if (tags && tags.length > 0) {
      formData.append('tags', tags.join(','));
    }
    if (imagens && imagens.length > 0) {
      imagens.forEach((imagem, index) => {
        formData.append(`imagens`, imagem);
      });
    }

    return this.http.post<GaleriaDTO>(`${environment.apiUrl}/galeria/admin`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Atualizar galeria com múltiplas imagens
  updateGaleria(
    id: number,
    titulo: string,
    conteudo: string | null,
    anoLetivo: string | null,
    dataPublicacao: Date | null,
    tags: string[] | null,
    novasImagens: File[] | null,
    manterImagens: boolean = true,
    imagensRemover: string[] | null
  ): Observable<GaleriaDTO> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    if (conteudo) formData.append('conteudo', conteudo);
    if (anoLetivo) formData.append('anoLetivo', anoLetivo);
    if (dataPublicacao) {
      formData.append('dataPublicacao', dataPublicacao.toISOString().split('T')[0]);
    }
    if (tags && tags.length > 0) {
      formData.append('tags', tags.join(','));
    }
    if (novasImagens && novasImagens.length > 0) {
      novasImagens.forEach(imagem => {
        formData.append('novasImagens', imagem);
      });
    }
    formData.append('manterImagens', manterImagens.toString());
    if (imagensRemover && imagensRemover.length > 0) {
      formData.append('imagensRemover', imagensRemover.join(','));
    }

    return this.http.put<GaleriaDTO>(`${environment.apiUrl}/galeria/admin/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Deletar galeria
  deleteGaleria(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/galeria/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Upload múltiplo de imagens
  uploadImages(imagens: File[]): Observable<string[]> {
    const formData = new FormData();
    imagens.forEach(imagem => {
      formData.append('imagens', imagem);
    });

    return this.http.post<string[]>(`${environment.apiUrl}/galeria/admin/upload-images`, formData, {
      headers: this.getAuthHeaders()
    });
  }
}