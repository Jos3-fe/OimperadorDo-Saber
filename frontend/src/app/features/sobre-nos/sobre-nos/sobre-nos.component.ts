import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Curso } from '../../../core/models/curso';
import { DirecaoService } from '../../../core/services/direcao.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DirecaoDTO } from '../../../core/models/direcao';

@Component({
  selector: 'app-sobre-nos',
  standalone: true,
  imports: [
    CommonModule, 
        RouterModule,
  ],
  templateUrl: './sobre-nos.component.html',
  styleUrl: './sobre-nos.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class SobreNosComponent {
  direcao: DirecaoDTO[] = [];
    loading = true;
    page = 0;
    size = 10;
    totalRecords = 0;

  curso: Curso | undefined;


  constructor(
      private direcaoService: DirecaoService, 
      private messageService: MessageService
  ) {}
  
    ngOnInit(): void {
      this.loadDirecao();
    }
  
    loadDirecao(): void {
      this.loading = true;
      this.direcaoService.getTodosDirecao().subscribe({
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
}
