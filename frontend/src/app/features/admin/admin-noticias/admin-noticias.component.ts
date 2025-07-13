import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NoticiaService } from '../../../core/services/noticia.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NoticiaDTO } from '../../../core/models/noticia';

@Component({
  selector: 'app-admin-noticias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './admin-noticias.component.html',
  styleUrls: ['./admin-noticias.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AdminNoticiasComponent {
  noticias: any = { content: [], totalElements: 0 };
  loading = true;
  page = 0;
  size = 10;
  sortBy = 'dataPublicacao';
  sortDir = 'desc';

  constructor(
    private noticiaService: NoticiaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarNoticias();
  }

  carregarNoticias(): void {
    this.loading = true;
    this.noticiaService.getNoticiasPaginated(this.page, this.size, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        this.noticias = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar notícias:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar notícias'
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.size = event.rows;
    this.carregarNoticias();
  }

  editarNoticia(id: number): void {
    this.router.navigate(['/admin/editarnot', id]);
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta notícia?',
      accept: () => this.excluirNoticia(id)
    });
  }

  excluirNoticia(id: number): void {
    this.noticiaService.deleteNoticia(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Notícia excluída com sucesso'
        });
        this.carregarNoticias();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir notícia'
        });
      }
    });
  }

  novaNoticia(): void {
    this.router.navigate(['/admin/novonot']);
  }
}