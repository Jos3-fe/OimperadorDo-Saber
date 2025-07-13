import { Component, OnInit } from '@angular/core';
import { MensagemService } from '../../../core/services/mensagem.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ResponderMensagemModalComponent } from '../../responder-mensagem-modal/responder-mensagem-modal.component';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Importar ConfirmDialogModule

@Component({
  selector: 'app-admin-mensagens',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ToastrModule,
    ConfirmDialogModule // Adicionar ConfirmDialogModule aos imports
  ],
  templateUrl: './admin-mensagens.component.html',
  styleUrl: './admin-mensagens.component.scss',
  providers: [ConfirmationService, MessageService] // Adicionar MessageService e ConfirmationService aos providers
})
export class AdminMensagensComponent implements OnInit {
  
  Math = Math;
  
  mensagens: any[] = [];
  filteredMensagens: any[] = []; // Este array será o mesmo que 'mensagens' após a busca no backend
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  loading = true;
  searchTerm = '';
  
  constructor(
    private mensagemService: MensagemService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  
  ngOnInit(): void {
    this.carregarMensagens();
  }
  
  /**
   * Retorna um array de números de página para a paginação.
   * Limita o número de páginas visíveis para melhor UX.
   */
  getPaginas(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  /**
   * Carrega as mensagens do backend, aplicando paginação e termo de busca.
   */
  carregarMensagens(): void {
    this.loading = true;
    
    // Backend espera página baseada em 0, mas frontend usa baseada em 1
    const page = this.currentPage - 1;
    
    this.mensagemService.getMensagens(page, this.itemsPerPage, this.searchTerm).subscribe({
      next: (response) => {
        console.log('Resposta do backend:', response); // Para debug
        
        this.mensagens = response.content || [];
        this.totalItems = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.filteredMensagens = [...this.mensagens]; // 'filteredMensagens' agora é o resultado da busca do backend
        this.loading = false;
        
        console.log('Mensagens carregadas:', this.mensagens.length); // Para debug
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens:', err); // Para debug
        this.toastr.error('Erro ao carregar mensagens', 'Erro');
        this.loading = false;
        this.mensagens = [];
        this.filteredMensagens = [];
      }
    });
  }
  
  /**
   * Abre o modal para responder a uma mensagem específica.
   * @param mensagem A mensagem a ser respondida.
   */
  abrirModalResponder(mensagem: any): void {
    const modalRef = this.modalService.open(ResponderMensagemModalComponent, { size: 'lg' });
    modalRef.componentInstance.mensagem = mensagem;
    
    modalRef.result.then((result) => {
      if (result === 'respondida') {
        this.toastr.success('Mensagem respondida com sucesso', 'Sucesso');
        this.carregarMensagens(); // Recarrega as mensagens para refletir a mudança de status, se houver
      }
    }).catch(() => {});
  }
  
  /**
   * Deleta uma mensagem do backend.
   * @param id O ID da mensagem a ser deletada.
   */
  deletarMensagem(id: number): void {
    this.mensagemService.deletarMensagem(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Mensagem excluída com sucesso'
        });
        this.carregarMensagens(); // Recarrega as mensagens após a exclusão
      },
      error: (err) => {
        console.error('Erro ao excluir mensagem:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir mensagem'
        });
      }
    });
  }

  /**
   * Confirma a exclusão de uma mensagem antes de chamar o método de exclusão.
   * @param id O ID da mensagem a ser confirmada para exclusão.
   */
  confirmarExclusao(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta mensagem?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.deletarMensagem(id)
    });
  }
  
  /**
   * Altera a página atual e recarrega as mensagens.
   * @param page O número da página para navegar.
   */
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.carregarMensagens();
    }
  }
  
  /**
   * Manipula a mudança no termo de filtro/busca.
   * Reseta a página para 1 e recarrega as mensagens do backend com o novo termo.
   */
  onFilterChange(): void {
    this.currentPage = 1; // Sempre volta para a primeira página ao filtrar
    this.carregarMensagens(); // Recarrega as mensagens do backend com o novo termo de busca
  }

  /**
   * Função para otimizar a renderização do *ngFor.
   * @param index O índice do item.
   * @param mensagem O objeto mensagem.
   * @returns O ID único da mensagem.
   */
  trackByMensagemId(index: number, mensagem: any): any {
    return mensagem.id;
  }
}
