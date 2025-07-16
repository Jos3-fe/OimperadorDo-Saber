import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Curso } from '../models/curso';
import { AuthService } from './auth.service';
import { environment } from '../models/environment';



export interface CursosPaginados {
  content: Curso[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CursoPorCategoria {
  categoria: string;
  cursos: Curso[];
}
@Injectable({
  providedIn: 'root'
})
export class CursoService {
  

  constructor(private authService: AuthService, private http: HttpClient) { }

  
  // Buscar todos os cursos sem paginação para exibição pública
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${environment.apiUrl}`);
  }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getCursosAdmin(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${environment.apiUrl}/cursos/paginated`, { 
      params
    });
  }

  // Buscar curso para admin (com mais detalhes)
  getCursoAdmin(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${environment.apiUrl}/cursos/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCurso(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${environment.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(`${environment.apiUrl}/cursos/admin`, curso, {
      headers: this.getAuthHeaders()
    });
  }

  updateCurso(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${environment.apiUrl}/cursos/admin/${id}`, curso, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cursos/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/cursos/categorias`, {
      headers: this.getAuthHeaders()
    });
  }


  // Buscar cursos em destaque
  getCursosDestaque(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${environment.apiUrl}/cursos/destaque`);
  }

  // Buscar cursos por preço
  getCursosPorPreco(precoMin?: number, precoMax?: number): Observable<Curso[]> {
    let params = new HttpParams();
    if (precoMin !== undefined) {
      params = params.set('precoMin', precoMin.toString());
    }
    if (precoMax !== undefined) {
      params = params.set('precoMax', precoMax.toString());
    }

    return this.http.get<Curso[]>(`${environment.apiUrl}/por-preco`, { params });
  }

  // Buscar cursos por categoria
  getCursosPorCategoria(): Observable<CursoPorCategoria[]> {
    return this.http.get<CursoPorCategoria[]>(`${environment.apiUrl}/cursos/por-categoria`);
  }



/**
 * Busca cursos por categoria (filtrando no frontend)
 * @param categoria - A categoria dos cursos a serem buscados  
 * @returns Observable<Curso[]>
 */
buscarCursosPorCategoria(categoria: string): Observable<Curso[]> {
  return this.getCursos().pipe(
    map(cursos => cursos.filter(curso => 
      curso.categoria?.toLowerCase() === categoria.toLowerCase()
    )),
    catchError(error => {
      console.error(`Erro ao buscar cursos da categoria ${categoria}:`, error);
      return of([]);
    })
  );
}





buscarCursosPorCategoriaCategoria(categoria: string): Observable<Curso[]> {
  // Converte a categoria para o formato esperado pelo backend
  const categoriaBackend = this.converterCategoriaParaBackend(categoria);
  
  return this.http.get<Curso[]>(`${environment.apiUrl}/cursos/categoria/${categoriaBackend}`).pipe(
    catchError(error => {
      console.error(`Erro ao buscar cursos da categoria ${categoria}:`, error);
      return of([]);
    })
  );
}

private converterCategoriaParaBackend(categoria: string): string {
  // Define o tipo explicitamente
  const mapeamento: Record<string, string> = {
    'pre-escolar': 'pre-escolar',
    'ensino-primario': 'ensino-primario',
    'primeiro-ciclo': 'primeiro-ciclo',
    'segundo-ciclo': 'segundo-ciclo',
    // Adicione outras variações se necessário
    'pré-escolar': 'pre-escolar',
    'ensino primário': 'ensino-primario',
    'i ciclo': 'primeiro-ciclo',
    'ii ciclo': 'segundo-ciclo'
  };

  // Converte para minúsculas e remove acentos para melhor correspondência
  const categoriaNormalizada = categoria.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  return mapeamento[categoriaNormalizada] || categoria;
}


}