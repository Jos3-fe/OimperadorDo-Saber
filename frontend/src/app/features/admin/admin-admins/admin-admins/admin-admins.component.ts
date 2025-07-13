import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { Admin } from '../../../../core/models/admin';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-admins',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule
  ],
  templateUrl: './admin-admins.component.html',
  styleUrls: ['./admin-admins.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AdminAdminsComponent implements OnInit {
  administradores: Admin[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarAdministradores();
  }

  carregarAdministradores(): void {
    this.loading = true;
    this.adminService.getAdministradores().subscribe({
      next: (admins) => {
        this.administradores = admins;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar administradores:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar administradores'
        });
      }
    });
  }

  editarAdministrador(id: number): void {
    this.router.navigate(['/admin/editarad', id]);
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este administrador?',
      accept: () => this.excluirAdministrador(id)
    });
  }

  excluirAdministrador(id: number): void {
    this.adminService.excluirAdministrador(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Administrador excluído com sucesso'
        });
        this.carregarAdministradores();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir administrador'
        });
      }
    });
  }

  toggleAtivo(id: number): void {
    this.adminService.toggleAtivo(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Status alterado com sucesso'
        });
        this.carregarAdministradores();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao alterar status'
        });
      }
    });
  }

  novoAdministrador(): void {
    this.router.navigate(['/admin/novoad']);
  }


  getSeverity(ativo: boolean): 'success' | 'danger' {
  return ativo ? 'success' : 'danger';
}
}