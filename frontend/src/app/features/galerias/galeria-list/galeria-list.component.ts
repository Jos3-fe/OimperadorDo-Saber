import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Para mensagens de erro/sucesso
import { ToastModule } from 'primeng/toast'; // Módulo Toast
import { ButtonModule } from 'primeng/button'; // Para botões
import { CardModule } from 'primeng/card'; // Para os cards das galerias
import { PaginatorModule } from 'primeng/paginator'; // Para paginação
import { DropdownModule } from 'primeng/dropdown'; // Para os filtros de dropdown
import { FormsModule } from '@angular/forms'; // Para ngModel nos filtros
import { GaleriaService } from '../../../core/services/galeria.service';
import { Curso } from '../../../core/models/curso';

@Component({
  selector: 'app-galerias',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule,
    CardModule,
    PaginatorModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './galeria-list.component.html',
  styleUrl: './galeria-list.component.scss',
  providers: [MessageService] // Fornece o MessageService
})
export class GaleriaListComponent implements OnInit {


  curso: Curso | undefined;

  galerias: any = { content: [], totalElements: 0 }; // Objeto para os dados paginados da API
  loading: boolean = true;
  
  // Variáveis para paginação e ordenação
  page: number = 0;
  size: number = 12; // Número de itens por página, ajuste conforme necessário
  sortBy: string = 'dataPublicacao';
  sortDir: string = 'desc';

  // Variáveis e opções para filtros
  anosLetivosOptions: any[] = [];
  tagsOptions: any[] = [];
  anoSelecionado: string | null = null;
  tagSelecionada: string | null = null;

  constructor(
    private galeriaService: GaleriaService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.carregarGalerias();
    this.carregarAnosLetivos(); // Carrega opções para filtro de ano
    this.carregarTags(); // Carrega opções para filtro de tag
  }

  /**
   * Carrega a lista de galerias do backend com base nos filtros e paginação atuais.
   */
  carregarGalerias(): void {
    this.loading = true;
    
    // Lógica para aplicar filtros
    if (this.anoSelecionado) {
      this.galeriaService.getGaleriasByAnoPaginated(this.anoSelecionado, this.page, this.size)
        .subscribe({
          next: (response: any) => {
            this.galerias = response;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar galerias por ano:', err);
            this.processarErro(err);
          }
        });
    } else if (this.tagSelecionada) {
      // Se você tiver um endpoint paginado para tags, use-o.
      // Caso contrário, você pode buscar todos e paginar/filtrar no frontend,
      // ou o backend precisa ser ajustado para paginar por tag.
      // Por enquanto, usarei o getGaleriasByTag que retorna um array.
      // Se for um array, precisaremos simular a paginação aqui.
      this.galeriaService.getGaleriasByTag(this.tagSelecionada)
        .subscribe({
          next: (response: any[]) => {
            // Simulação de paginação no frontend para getGaleriasByTag
            const startIndex = this.page * this.size;
            const endIndex = startIndex + this.size;
            this.galerias = {
              content: response.slice(startIndex, endIndex),
              totalElements: response.length,
              // Outras propriedades necessárias para o paginator
              number: this.page,
              size: this.size,
              totalPages: Math.ceil(response.length / this.size),
              first: this.page === 0,
              last: endIndex >= response.length,
              numberOfElements: response.slice(startIndex, endIndex).length
            };
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar galerias por tag:', err);
            this.processarErro(err);
          }
        });
    } else {
      // Carregar todas as galerias paginadas
      this.galeriaService.getGaleriasPaginated(this.page, this.size, this.sortBy, this.sortDir)
        .subscribe({
          next: (response: any) => {
            this.galerias = response;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar galerias paginadas:', err);
            this.processarErro(err);
          }
        });
    }
  }

  /**
   * Carrega as opções de anos letivos para o filtro.
   */
  carregarAnosLetivos(): void {
    this.galeriaService.getAnosLetivos().subscribe({
      next: (anos) => {
        this.anosLetivosOptions = [
          { label: 'Todos os Anos', value: null }, // Opção para remover filtro
          ...anos.map(ano => ({ label: ano, value: ano }))
        ];
      },
      error: (err) => {
        console.error('Erro ao carregar anos letivos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar anos letivos.'
        });
      }
    });
  }

  /**
   * Carrega as opções de tags para o filtro.
   */
  carregarTags(): void {
    this.galeriaService.getTags().subscribe({
      next: (tags) => {
        this.tagsOptions = [
          { label: 'Todas as Tags', value: null }, // Opção para remover filtro
          ...tags.map(tag => ({ label: tag, value: tag }))
        ];
      },
      error: (err) => {
        console.error('Erro ao carregar tags:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar tags.'
        });
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
    this.carregarGalerias();
  }

  /**
   * Filtra as galerias pelo ano letivo selecionado.
   */
  filtrarPorAno(): void {
    this.page = 0; // Volta para a primeira página ao filtrar
    this.tagSelecionada = null; // Limpa o filtro de tag
    this.carregarGalerias();
  }

  /**
   * Filtra as galerias pela tag selecionada.
   */
  filtrarPorTag(): void {
    this.page = 0; // Volta para a primeira página ao filtrar
    this.anoSelecionado = null; // Limpa o filtro de ano
    this.carregarGalerias();
  }

  /**
   * Navega para a página de detalhes de uma galeria.
   * @param id O ID da galeria.
   */
  verGaleria(id: number): void {
    // Esta rota deve apontar para o componente de detalhes de galeria público
    this.router.navigate(['/galerias', id]); 
  }

  /**
   * Exibe uma mensagem de erro na tela.
   * @param err O objeto de erro retornado pela requisição.
   */
  processarErro(err: any): void {
    this.loading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: `Erro ao carregar galerias: ${err.message || 'Erro desconhecido'}`
    });
    this.galerias = { content: [], totalElements: 0 }; // Limpa os dados em caso de erro
  }

  /**
   * Função para otimizar a renderização do *ngFor.
   * @param index O índice do item.
   * @param galeria O objeto galeria.
   * @returns O ID único da galeria.
   */
  trackByGaleriaId(index: number, galeria: any): any {
    return galeria.id;
  }
}
