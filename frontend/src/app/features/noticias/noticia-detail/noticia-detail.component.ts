import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'; // Para estilizar o conteúdo
import { NoticiaService } from '../../../core/services/noticia.service';

@Component({
  selector: 'app-noticia-detail',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './noticia-detail.component.html',
  styleUrl: './noticia-detail.component.scss',
  providers: [MessageService]
})
export class NoticiaDetailComponent implements OnInit {

  noticia: any; // Objeto para armazenar os detalhes da notícia
  loading: boolean = true; // Indica se os dados estão sendo carregados

  constructor(
    private route: ActivatedRoute,
    private noticiaService: NoticiaService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Inscreve-se nas mudanças dos parâmetros da rota
    this.route.paramMap.subscribe(params => {
      const noticiaId = params.get('id'); // Obtém o ID da URL
      if (noticiaId) {
        this.carregarDetalhesNoticia(Number(noticiaId)); // Converte para número e carrega os detalhes
      } else {
        console.error('ID da notícia não encontrado na rota.');
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID da notícia não fornecido.'
        });
        this.loading = false;
      }
    });
  }

  /**
   * Carrega os detalhes de uma notícia específica do backend.
   * @param id O ID da notícia a ser carregada.
   */
  carregarDetalhesNoticia(id: number): void {
    this.loading = true;
    this.noticiaService.getNoticiaById(id).subscribe({
      next: (data) => {
        this.noticia = data;
        this.loading = false;
        console.log('Detalhes da notícia carregados:', this.noticia);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da notícia:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os detalhes da notícia.'
        });
        this.loading = false;
      }
    });
  }

  /**
   * Navega de volta para a lista de notícias.
   */
  voltar(): void {
    this.router.navigate(['/noticias']); // Rota da lista pública de notícias
  }
}
