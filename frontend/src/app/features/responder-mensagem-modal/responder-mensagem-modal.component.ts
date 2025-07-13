import { Component, Input } from '@angular/core';
import { MensagemService } from '../../core/services/mensagem.service';
import { AuthService } from '../../core/services/auth.service';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-responder-mensagem-modal',
  standalone: true,
  imports: [
    NgbModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './responder-mensagem-modal.component.html',
  styleUrl: './responder-mensagem-modal.component.scss'
})
export class ResponderMensagemModalComponent {



  @Input() mensagem: any;
  resposta = '';
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private mensagemService: MensagemService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  responder(): void {
    if (!this.resposta.trim()) {
      this.toastr.warning('Por favor, escreva uma resposta', 'Atenção');
      return;
    }

    this.loading = true;
    const adminId = this.authService.getUserId();

    if (!adminId) {
      this.toastr.error('Erro de autenticação', 'Erro');
      this.activeModal.dismiss();
      return;
    }
    

    this.mensagemService.responderMensagem(this.mensagem.id, this.resposta, adminId).subscribe({
      next: () => {
        this.toastr.success('Resposta enviada com sucesso', 'Sucesso');
        this.activeModal.close('respondida');
      },
      error: (err) => {
        this.toastr.error('Erro ao enviar resposta', 'Erro');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


}
