import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DirecaoDTO } from '../../../core/models/direcao';
import { DirecaoService } from '../../../core/services/direcao.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-direcao',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './admin-direcao.component.html',
  styleUrl: './admin-direcao.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class AdminDirecaoComponent {
  direcao: DirecaoDTO[] = [];
  loading = true;
  page = 0;
  size = 10;
  totalRecords = 0;

  constructor(
    private direcaoService: DirecaoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDirecao();
  }

  loadDirecao(): void {
    this.loading = true;
    this.direcaoService.getAllDirecao().subscribe({
      next: (direcao) => {
        this.direcao = direcao;
        this.totalRecords = direcao.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar membros da direção:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar membros da direção'
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.size = event.rows;
    this.loadDirecao();
  }

  editarMembro(id: number): void {
    this.router.navigate(['admin/editardi', id]);
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este membro da direção?',
      accept: () => this.excluirMembro(id)
    });
  }

  excluirMembro(id: number): void {
    this.direcaoService.deleteDirecao(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Membro excluído com sucesso'
        });
        this.loadDirecao();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir membro'
        });
      }
    });
  }

  novoMembro(): void {
    this.router.navigate(['admin/novodi']);
  }
}