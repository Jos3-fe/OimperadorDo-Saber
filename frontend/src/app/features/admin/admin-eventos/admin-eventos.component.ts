import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EventoService } from '../../../core/services/evento.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './admin-eventos.component.html',
  styleUrls: ['./admin-eventos.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AdminEventosComponent {
  eventos: any = { content: [], totalElements: 0 };
  loading = true;
  page = 0;
  size = 10;
  sortBy = 'dataEvento';
  sortDir = 'asc';

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.loading = true;
    this.eventoService.getEventosPaginated(this.page, this.size, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        this.eventos = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar eventos:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar eventos'
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.size = event.rows;
    this.carregarEventos();
  }

  editarEvento(id: number): void {
    this.router.navigate(['/admin/editareven', id]);
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este evento?',
      accept: () => this.excluirEvento(id)
    });
  }

  excluirEvento(id: number): void {
    this.eventoService.deleteEvento(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Evento excluído com sucesso'
        });
        this.carregarEventos();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir evento'
        });
      }
    });
  }

  novoEvento(): void {
    this.router.navigate(['/admin/novoeven']);
  }
}