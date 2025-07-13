import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { NoticiaService } from '../../../core/services/noticia.service';
import { Curso } from '../../../core/models/curso';

@Component({
  selector: 'app-noticia-list',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule,
    CardModule,
    PaginatorModule
  ],
  templateUrl: './noticia-list.component.html',
  styleUrl: './noticia-list.component.scss',
  providers: [MessageService]
})
export class NoticiaListComponent implements OnInit {

  curso: Curso | undefined;

  noticias: any = { content: [], totalElements: 0 }; // Objeto para os dados paginados da API
  loading: boolean = true;
  
  // Variáveis para paginação e ordenação
  page: number = 0;
  size: number = 10; // Número de itens por página
  totalRecords: number = 0;
  sortBy: string = 'dataPublicacao';
  sortDir: string = 'desc';

  constructor(
    private noticiaService: NoticiaService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.carregarNoticias();
  }

  /**
   * Carrega a lista de notícias do backend com base na paginação e ordenação.
   */
  carregarNoticias(): void {
    this.loading = true;
    this.noticiaService.getNoticiasPaginated(this.page, this.size, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        console.log('Resposta do backend (Notícias):', response);
        this.noticias = response;
        this.totalRecords = response.totalElements || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar notícias:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as notícias.'
        });
        this.loading = false;
        this.noticias = { content: [], totalElements: 0 }; // Limpa a lista em caso de erro
      }
    });
  }

  /**
   * Manipula a mudança de página do Paginator.
   * @param event Evento de paginação do PrimeNG.
   */
  onPageChange(event: any): void {
    this.page = event.page; // page é base 0 no PrimeNG Paginator
    this.size = event.rows;
    this.carregarNoticias();
  }

  /**
   * Navega para a página de detalhes de uma notícia.
   * @param id O ID da notícia.
   */
  verNoticia(id: number): void {
    this.router.navigate(['/noticias', id]); 
  }

  /**
   * Trunca o conteúdo da notícia para criar um snippet.
   * @param content O conteúdo completo da notícia.
   * @param maxLength O comprimento máximo do snippet.
   * @returns O snippet truncado.
   */
  truncateContent(content: string, maxLength: number): string {
    if (!content) return '';
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  /**
   * Função para otimizar a renderização do *ngFor.
   * @param index O índice do item.
   * @param noticia O objeto notícia.
   * @returns O ID único da notícia.
   */
  trackByNoticiaId(index: number, noticia: any): any {
    return noticia.id;
  }
}
