import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoticiaService } from '../../../../core/services/noticia.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-noticia-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './admin-noticias.component.html',
  styleUrls: ['./admin-noticias.component.scss'],
  providers: [MessageService]
})
export class AdminNoticiaFormComponent implements OnInit {
  noticiaForm: FormGroup;
  isEdit = false;
  noticiaId?: number;
  imagemPreview?: string;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private noticiaService: NoticiaService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.noticiaForm = this.fb.group({
      titulo: ['', Validators.required],
      conteudo: ['', Validators.required],
      imgUrl: [null],
      manterImagem: [true]
    });
  }

  ngOnInit(): void {
    this.noticiaId = this.route.snapshot.params['id'];
    if (this.noticiaId) {
      this.isEdit = true;
      this.carregarNoticia(this.noticiaId);
    }
  }

  carregarNoticia(id: number): void {
    this.noticiaService.getNoticiaById(id).subscribe({
      next: (noticia) => {
        this.noticiaForm.patchValue(noticia);
        if (noticia.imgUrl) {
          this.imagemPreview = noticia.imgUrl;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar notícia', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar notícia'
        });
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0] || null;
    this.selectedFile = file;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      if (this.isEdit) {
        this.noticiaForm.patchValue({ manterImagem: false });
      }
    } else {
      this.imagemPreview = undefined;
    }
  }

  onSubmit(): void {
    if (this.noticiaForm.valid) {
      const adminId = this.authService.currentAdmin?.id; 
      if (!adminId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'ID do administrador não encontrado'
        });
        return;
      }

      const operation = this.isEdit && this.noticiaId
        ? this.noticiaService.updateNoticia(
            this.noticiaId,
            this.noticiaForm.value.titulo,
            this.noticiaForm.value.conteudo,
            this.selectedFile,
            this.noticiaForm.value.manterImagem)
        : this.noticiaService.createNoticia(
            this.noticiaForm.value.titulo,
            this.noticiaForm.value.conteudo,
            this.selectedFile,
            adminId);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Notícia ${this.isEdit ? 'atualizada' : 'criada'} com sucesso`
          });
          this.router.navigate(['/admin/noticias']);
        },
        error: (err) => {
          console.error('Erro ao salvar notícia', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao ${this.isEdit ? 'atualizar' : 'criar'} notícia`
          });
        }
      });
    } else {
      this.noticiaForm.markAllAsTouched();
    }
  }
}