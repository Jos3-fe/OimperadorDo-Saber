import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  faBook, 
  faCalendarAlt, 
  faEnvelope, 
  faUsers,
  faFileAlt,
  faImage,
  faNewspaper,
  faInfoCircle,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { MensagemService } from '../../../core/services/mensagem.service';
import { ToastrService } from 'ngx-toastr';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Ícones
  icons = {
    mensagens: faEnvelope,
    stats: faChartBar
  };

  // Mensagens
  recentMessages: any[] = [];
  loading = true;

  constructor(
    private mensagemService: MensagemService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarMensagens();
  }

  /**
   * Carrega as mensagens não lidas (ou todas) para o dashboard
   */
  carregarMensagens(): void {
    this.loading = true;
    
    // Parâmetros para buscar apenas mensagens não lidas (opcional)
    const params = {
      page: '0', // Primeira página
      size: '5', // Limite de mensagens exibidas
      sortBy: 'dataCriacao',
      sortDir: 'desc'
    };

    this.mensagemService.getMensagens(0, 5).subscribe({
      next: (response) => {
        this.recentMessages = response.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens:', err);
        this.toastr.error('Erro ao carregar mensagens', 'Erro');
        this.loading = false;
      }
    });
  }
}