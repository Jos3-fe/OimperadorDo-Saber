import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NoticiaDTO } from '../models/noticia'; // Certifique-se que este caminho está correto
import { environment } from '../models/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  

  constructor(private authService: AuthService, private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  /**
   * Público - Lista notícias paginadas para exibição no frontend.
   * Não envia cabeçalhos de autenticação.
   * @param page Número da página (base 0).
   * @param size Tamanho da página.
   * @param sortBy Campo para ordenar.
   * @param sortDir Direção da ordenação ('asc' ou 'desc').
   * @returns Um Observable com os dados paginados das notícias.
   */
  getNoticiasPaginated(page: number = 0, size: number = 10, sortBy: string = 'dataPublicacao', sortDir: string = 'desc'): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    };
    
    return this.http.get<any>(`${environment.apiUrl}/noticias/paginated`, { params });
  }
   
  /**
   * Público - Busca uma notícia específica pelo ID.
   * Não envia cabeçalhos de autenticação.
   * @param id O ID da notícia.
   * @returns Um Observable com os detalhes da notícia.
   */
  getNoticiaById(id: number): Observable<NoticiaDTO> {
    return this.http.get<NoticiaDTO>(`${environment.apiUrl}/${id}`);
  }

  /**
   * Admin - Cria uma nova notícia com imagem.
   * Requer autenticação.
   * @param titulo Título da notícia.
   * @param conteudo Conteúdo completo da notícia.
   * @param imagem Arquivo de imagem (opcional).
   * @param adminId ID do administrador.
   * @returns Um Observable com a NoticiaDTO criada.
   */
  createNoticia(
    titulo: string,
    conteudo: string,
    imagem: File | null,
    adminId: number
  ): Observable<NoticiaDTO> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('conteudo', conteudo);
    if (imagem) formData.append('imagem', imagem);

    const headers = this.getAuthHeaders()
      .set('admin-id', adminId.toString()); // Certifique-se de que o backend usa este header

    return this.http.post<NoticiaDTO>(`${environment.apiUrl}/noticias/admin`, formData, { headers });
  }

  /**
   * Admin - Atualiza uma notícia existente com ou sem nova imagem.
   * Requer autenticação.
   * @param id O ID da notícia a ser atualizada.
   * @param titulo Novo título.
   * @param conteudo Novo conteúdo.
   * @param imagem Nova imagem (opcional).
   * @param manterImagem Flag para manter a imagem existente se nenhuma nova for enviada.
   * @returns Um Observable com a NoticiaDTO atualizada.
   */
  updateNoticia(
    id: number,
    titulo: string,
    conteudo: string,
    imagem: File | null,
    manterImagem: boolean = true
  ): Observable<NoticiaDTO> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('conteudo', conteudo);
    if (imagem) formData.append('imagem', imagem);
    formData.append('manterImagem', manterImagem.toString());

    return this.http.put<NoticiaDTO>(`${environment.apiUrl}/noticias/admin/${id}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Admin - Deleta uma notícia.
   * Requer autenticação.
   * @param id O ID da notícia a ser deletada.
   * @returns Um Observable vazio.
   */
  deleteNoticia(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/noticias/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Admin - Faz upload apenas de uma imagem para notícias (se necessário separadamente).
   * Requer autenticação.
   * @param imagem O arquivo de imagem a ser enviado.
   * @returns Um Observable com a URL da imagem.
   */
  uploadImage(imagem: File): Observable<string> {
    const formData = new FormData();
    formData.append('imagem', imagem);

    return this.http.post<string>(`${environment.apiUrl}/noticias/admin/upload-image`, formData, {
      headers: this.getAuthHeaders()
    });
  }
}
