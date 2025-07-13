import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DocumentoService } from '../../../core/services/documento.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DocumentoDTO } from '../../../core/models/documento';
import { FileSizePipe } from '../../../core/models/file-size.pipe';

@Component({
  selector: 'app-admin-documentos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    FileSizePipe
  ],
  templateUrl: './admin-documento.component.html',
  styleUrls: ['./admin-documento.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AdminDocumentosComponent {
  documentos: any = { content: [], totalElements: 0 };
  loading = true;
  page = 0;
  size = 10;
  sortBy = 'dataUpload';
  sortDir = 'desc';

  constructor(
    private documentoService: DocumentoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  carregarDocumentos(): void {
    this.loading = true;
    this.documentoService.getDocumentosPaginated(this.page, this.size, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        this.documentos = response;
        
        // DEBUG: Adicione este console.log para verificar os dados
        console.log('Dados recebidos:', response);
        console.log('Primeiro documento:', response.content[0]);
        
        // Verificar se os campos existem
        if (response.content && response.content.length > 0) {
          const primeiroDoc = response.content[0];
          console.log('Descrição:', primeiroDoc.descricao);
          console.log('Tamanho:', primeiroDoc.tamanho);
          console.log('Tipo do tamanho:', typeof primeiroDoc.tamanho);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar documentos:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar documentos'
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.size = event.rows;
    this.carregarDocumentos();
  }

  baixarDocumento(documento: DocumentoDTO): void {
    // CORREÇÃO: Usar o ID do documento, não o filePath
    this.documentoService.downloadDocumento(documento.id).subscribe({
      next: (blob) => {
        // Verificar se o blob tem conteúdo
        if (blob.size === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Arquivo não encontrado ou vazio'
          });
          return;
        }

        // Criar URL do blob e fazer download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = documento.nome || 'documento';
        
        // Adicionar ao DOM temporariamente para alguns navegadores
        document.body.appendChild(link);
        link.click();
        
        // Limpar recursos
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar documento:', err);
        let errorMessage = 'Erro ao baixar documento';
        
        if (err.status === 404) {
          errorMessage = 'Documento não encontrado';
        } else if (err.status === 403) {
          errorMessage = 'Acesso negado';
        } else if (err.status === 500) {
          errorMessage = 'Erro interno do servidor';
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: errorMessage
        });
      }
    });
  }

  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este documento?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-info-circle',
      accept: () => this.excluirDocumento(id)
    });
  }

  excluirDocumento(id: number): void {
    this.documentoService.deleteDocumento(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Documento excluído com sucesso'
        });
        this.carregarDocumentos();
      },
      error: (err) => {
        console.error('Erro ao excluir documento:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir documento'
        });
      }
    });
  }

  novoDocumento(): void {
    this.router.navigate(['/admin/novodoc']);
  }

  // Método auxiliar para debug
  debugDocumento(documento: any): void {
    console.log('Documento completo:', documento);
  }
}