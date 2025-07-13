import { Component } from '@angular/core';
import { DocumentoService } from '../../../../core/services/documento.service';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  standalone: true,
  selector: 'app-admin-documento-form',
  templateUrl: './admin-documento-form.component.html',
  styleUrls: ['./admin-documento-form.component.scss'],
  imports: [FormsModule, ToastModule,  CommonModule,
      RouterModule,
      TableModule,
      ButtonModule,
      ConfirmDialogModule,
      ToastModule],
  providers: [MessageService]
})
export class AdminDocumentoFormComponent {
  selectedFile: File | null = null;
  descricao: string = '';

  constructor(
    private documentoService: DocumentoService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {} 

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, selecione um arquivo PDF válido'
      });
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const adminId = this.authService.currentAdmin?.id; // Implemente este método no AuthService
      
      if (!adminId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID do administrador não encontrado'
        });
        return;
      }

      this.documentoService.uploadDocumento(this.selectedFile, adminId, this.descricao).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Documento enviado com sucesso'
          });
          this.router.navigate(['/admin/documentos']);
        },
        error: (err) => {
          console.error('Erro ao enviar documento:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao enviar documento'
          });
        }
      });
    }
  }
}