import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, date pipe
import { Router } from '@angular/router'; // Para navegação, se necessário
import { MessageService } from 'primeng/api'; // Para mensagens Toast
import { ToastModule } from 'primeng/toast'; // Módulo PrimeNG Toast
import { ButtonModule } from 'primeng/button'; // Módulo PrimeNG Button
import { PaginatorModule } from 'primeng/paginator'; // Módulo PrimeNG Paginator
import { InputTextModule } from 'primeng/inputtext'; // Para um campo de busca, se for adicionar no futuro
import { FormsModule } from '@angular/forms'; // Para ngModel
import { DocumentoService } from '../../../core/services/documento.service';
import { Curso } from '../../../core/models/curso';

@Component({
  selector: 'app-documento-list',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './documento-list.component.html',
  styleUrl: './documento-list.component.scss',
  providers: [MessageService] // Fornece o MessageService para este componente
})
export class DocumentoListComponent implements OnInit {

  curso: Curso | undefined;

  documentos: any[] = []; // Array para armazenar os documentos
  loading: boolean = true; // Estado de carregamento
  
  // Propriedades para paginação
  page: number = 0; // Página atual (base 0 para o backend)
  size: number = 10; // Número de itens por página
  totalRecords: number = 0; // Total de documentos
  
  sortBy: string = 'dataUpload'; // Campo para ordenação
  sortDir: string = 'desc'; // Direção da ordenação (descendente por padrão)

  // O serviço de documento não tem um método de busca por termo para a listagem pública,
  // então não usaremos searchTerm aqui por enquanto. Se precisar, o backend e o service teriam que ser atualizados.
  // searchTerm: string = ''; 

  constructor(
    private documentoService: DocumentoService,
    private router: Router, // Injetar Router, caso precise de navegação
    private messageService: MessageService // Injetar MessageService
  ) { }

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  /**
   * Carrega a lista de documentos do backend com base na paginação e ordenação.
   */
  carregarDocumentos(): void {
    this.loading = true;
    this.documentoService.getDocumentosPaginatedPublico(this.page, this.size, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        console.log('Resposta do backend (Documentos):', response);
        this.documentos = response.content || [];
        this.totalRecords = response.totalElements || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar documentos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os documentos.'
        });
        this.loading = false;
        this.documentos = []; // Limpa a lista em caso de erro
      }
    });
  }

  /**
   * Manipula a mudança de página do Paginator.
   * @param event Evento de paginação do PrimeNG (contém page e rows).
   */
  onPageChange(event: any): void {
    this.page = event.page; // PrimeNG Paginator usa page base 0
    this.size = event.rows;
    this.carregarDocumentos();
  }

  /**
   * Inicia o download de um documento.
   * @param documentoId O ID do documento a ser baixado.
   * @param fileName O nome do arquivo para salvar (pode ser o nome vindo do backend, ex: documento.nome).
   */
  downloadDocumento(documentoId: number, fileName: string): void {
    this.messageService.add({ severity: 'info', summary: 'Download', detail: 'Preparando download...' });
    this.documentoService.downloadDocumento(documentoId).subscribe({
      next: (blob: Blob) => {
        // Cria um URL temporário para o blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = fileName; // Define o nome do arquivo para download
        a.click(); // Simula o clique no link para iniciar o download
        window.URL.revokeObjectURL(url); // Libera o URL temporário
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Download iniciado!' });
      },
      error: (err) => {
        console.error('Erro ao baixar documento:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível baixar o documento.'
        });
      }
    });
  }

  /**
   * Função para otimizar a renderização do *ngFor.
   * @param index O índice do item.
   * @param documento O objeto documento.
   * @returns O ID único do documento.
   */
  trackByDocumentoId(index: number, documento: any): any {
    return documento.id;
  }

  /**
   * Retorna o ícone apropriado com base no tipo de arquivo (extensão).
   * @param fileName O nome completo do arquivo.
   * @returns Classe de ícone Font Awesome.
   */
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel text-success';
      case 'ppt':
      case 'pptx':
        return 'fas fa-file-powerpoint text-warning';
      case 'zip':
      case 'rar':
        return 'fas fa-file-archive text-secondary';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'fas fa-file-image text-info';
      default:
        return 'fas fa-file text-muted';
    }
  }
}
