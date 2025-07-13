import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngIf, *ngFor
import { ActivatedRoute, Router } from '@angular/router'; // Para acessar parâmetros da rota e navegar
import { ButtonModule } from 'primeng/button'; // Para o botão "Voltar"
import { CarouselModule } from 'primeng/carousel'; // Para o carrossel de imagens
import { ToastModule } from 'primeng/toast'; // Para mensagens de notificação
import { MessageService } from 'primeng/api'; // Serviço para exibir mensagens do PrimeNG
import { GaleriaService } from '../../../core/services/galeria.service';

@Component({
  selector: 'app-galeria-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CarouselModule,
    ToastModule
  ],
  templateUrl: './galeria-detail.component.html',
  styleUrl: './galeria-detail.component.scss',
  providers: [MessageService] // Fornece o MessageService para este componente
})
export class GaleriaDetailComponent implements OnInit {

  galeria: any; // Objeto para armazenar os detalhes da galeria
  loading: boolean = true; // Indica se os dados estão sendo carregados
  images: any[] = []; // Array para as imagens do carrossel
  
  // Opções responsivas para o carrossel do PrimeNG
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px', // Para telas de até 1024px de largura
      numVisible: 3, // 3 imagens visíveis
      numScroll: 3 // Rola 3 imagens por vez
    },
    {
      breakpoint: '768px', // Para telas de até 768px de largura
      numVisible: 2, // 2 imagens visíveis
      numScroll: 2 // Rola 2 imagens por vez
    },
    {
      breakpoint: '560px', // Para telas de até 560px de largura
      numVisible: 1, // 1 imagem visível
      numScroll: 1 // Rola 1 imagem por vez
    }
  ];

  constructor(
    private route: ActivatedRoute, // Para obter parâmetros da URL
    private galeriaService: GaleriaService, // Serviço para interagir com a API de galerias
    private router: Router, // Para navegação programática
    private messageService: MessageService // Para exibir mensagens ao usuário
  ) { }

  ngOnInit(): void {
    // Inscreve-se nas mudanças dos parâmetros da rota
    this.route.paramMap.subscribe(params => {
      const galeriaId = params.get('id'); // Obtém o ID da URL
      if (galeriaId) {
        this.carregarDetalhesGaleria(Number(galeriaId)); // Converte para número e carrega os detalhes
      } else {
        console.error('ID da galeria não encontrado na rota.');
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID da galeria não fornecido.'
        });
        this.loading = false; // Parar o carregamento se não houver ID
      }
    });
  }

  /**
   * Carrega os detalhes de uma galeria específica do backend.
   * @param id O ID da galeria a ser carregada.
   */
  carregarDetalhesGaleria(id: number): void {
    this.loading = true; // Inicia o estado de carregamento
    this.galeriaService.getGaleriaById(id).subscribe({
      next: (data) => {
        this.galeria = data; // Atribui os dados da galeria
        // Verifica se 'imagens' existe e não está vazio, caso contrário, inicializa como array vazio
        this.images = this.galeria.imagens && this.galeria.imagens.length > 0
                      ? this.galeria.imagens
                      : [];
        this.loading = false; // Finaliza o estado de carregamento
        console.log('Detalhes da galeria carregados:', this.galeria);
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da galeria:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os detalhes da galeria.'
        });
        this.loading = false; // Finaliza o estado de carregamento em caso de erro
      }
    });
  }

  /**
   * Navega de volta para a lista de galerias.
   */
  voltar(): void {
    // Ajuste a rota para o seu componente de listagem de galerias,
    // seja ele público ou na área de administração.
    // Ex: Se for admin: this.router.navigate(['/admin/galeria']);
    // Ex: Se for público: this.router.navigate(['/galerias']); // Se existir uma rota pública para listar galerias
    this.router.navigate(['galerias']); // Mantendo a consistência com a rota que te trouxe aqui (Admin)
  }
}
