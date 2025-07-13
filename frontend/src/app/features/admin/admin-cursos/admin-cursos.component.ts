import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Curso } from '../../../core/models/curso';
import { CursoService } from '../../../core/services/curso.service';
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-cursos',
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
  templateUrl: './admin-cursos.component.html',
  styleUrl: './admin-cursos.component.scss',
  providers: [ConfirmationService, MessageService] 
})
export class AdminCursosComponent {
  cursos: Curso[] = [];
  loading = true;
  page = 0;
  size = 10;
  totalRecords = 0;

  constructor(
    private cursoService: CursoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loadCursos();
  }

  loadCursos(): void {
    this.loading = true;
    this.cursoService.getCursosAdmin(this.page, this.size).subscribe({
      next: (response) => {
        this.cursos = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar cursos:', err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.size = event.rows;
    this.loadCursos();
  }

  editarCurso(id: number): void {
    this.router.navigate(['/admin/editarcu', id]);
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este curso?',
      accept: () => this.excluirCurso(id)
    });
  }

  excluirCurso(id: number): void {
    this.cursoService.deleteCurso(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Curso excluído com sucesso'
        });
        this.loadCursos();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir curso'
        });
      }
    });
  }

  novoCurso(): void {
    this.router.navigate(['/admin/novocu']);
  }

}