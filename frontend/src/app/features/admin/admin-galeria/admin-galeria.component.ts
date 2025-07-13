import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GaleriaService } from '../../../core/services/galeria.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-galerias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './admin-galeria.component.html',
  styleUrls: ['./admin-galeria.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AdminGaleriasComponent implements OnInit {
  galerias: any = { content: [], totalElements: 0 };
  loading = true;
  page = 0;
  size = 12;
  sortBy = 'dataPublicacao';
  sortDir = 'desc';
  
  // CORREÇÃO: Formato correto para dropdowns do PrimeNG
  anosLetivosOptions: any[] = [];
  tagsOptions: any[] = [];
  anoSelecionado: string | null = null;
  tagSelecionada: string | null = null;

  constructor(
    private galeriaService: GaleriaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarGalerias();
    this.carregarAnosLetivos();
    this.carregarTags();
  }

  carregarGalerias(): void {
    this.loading = true;
    
    console.log('Carregando galerias...', {
      anoSelecionado: this.anoSelecionado,
      tagSelecionada: this.tagSelecionada,
      page: this.page,
      size: this.size
    });
    
    if (this.anoSelecionado) {
      this.galeriaService.getGaleriasByAnoPaginated(this.anoSelecionado, this.page, this.size)
        .subscribe({
          next: (response: any) => {
            console.log('Resposta galerias por ano:', response);
            this.galerias = response;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar galerias por ano:', err);
            this.processarErro()(err);
          }
        });
    } else if (this.tagSelecionada) {
      this.galeriaService.getGaleriasByTag(this.tagSelecionada)
        .subscribe({
          next: (galerias) => {
            console.log('Resposta galerias por tag:', galerias);
            this.galerias = {
              content: galerias,
              totalElements: galerias.length,
              totalPages: 1,
              first: true,
              last: true,
              numberOfElements: galerias.length
            };
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar galerias por tag:', err);
            this.processarErro()(err);
          }
        });
    } else {
      this.galeriaService.getGaleriasPaginated(this.page, this.size, this.sortBy, this.sortDir)
        .subscribe({
          next: (response: any) => {
            console.log('Resposta galerias paginadas:', response);
            this.galerias = response;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar galerias paginadas:', err);
            this.processarErro()(err);
          }
        });
    }
  }

  carregarAnosLetivos(): void {
    this.galeriaService.getAnosLetivos().subscribe({
      next: (anos) => {
        console.log('Anos letivos recebidos:', anos);
        // CORREÇÃO: Converter para formato do dropdown
        this.anosLetivosOptions = [
          { label: 'Todos os anos', value: null },
          ...anos.map(ano => ({ label: ano, value: ano }))
        ];
      },
      error: (err) => {
        console.error('Erro ao carregar anos letivos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar anos letivos'
        });
      }
    });
  }

  carregarTags(): void {
    this.galeriaService.getTags().subscribe({
      next: (tags) => {
        console.log('Tags recebidas:', tags);
        // CORREÇÃO: Converter para formato do dropdown
        this.tagsOptions = [
          { label: 'Todas as tags', value: null },
          ...tags.map(tag => ({ label: tag, value: tag }))
        ];
      },
      error: (err) => {
        console.error('Erro ao carregar tags:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar tags'
        });
      }
    });
  }

  processarErro() {
    return (err: any) => {
      console.error('Erro detalhado:', err);
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: `Erro ao carregar dados: ${err.message || 'Erro desconhecido'}`
      });
    };
  }

  onPageChange(event: any): void {
    console.log('Mudança de página:', event);
    this.page = event.page;
    this.size = event.rows;
    this.carregarGalerias();
  }

  filtrarPorAno(): void {
    console.log('Filtrar por ano:', this.anoSelecionado);
    this.page = 0;
    this.tagSelecionada = null;
    this.carregarGalerias();
  }

  filtrarPorTag(): void {
    console.log('Filtrar por tag:', this.tagSelecionada);
    this.page = 0;
    this.anoSelecionado = null;
    this.carregarGalerias();
  }

  verGaleria(id: number): void {
    this.router.navigate(['/galerias', id]);
  }

  editarGaleria(id: number): void {
    this.router.navigate(['/admin/editargal', id]);
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta galeria? Todas as imagens serão removidas.',
      accept: () => this.excluirGaleria(id)
    });
  }

  excluirGaleria(id: number): void {
    this.galeriaService.deleteGaleria(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Galeria excluída com sucesso'
        });
        this.carregarGalerias();
      },
      error: (err) => {
        console.error('Erro ao excluir galeria:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir galeria'
        });
      }
    });
  }

  novaGaleria(): void {
    this.router.navigate(['/admin/novogal']);
  }
}