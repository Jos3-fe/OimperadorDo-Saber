import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GaleriaService } from '../../../../core/services/galeria.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-galeria-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './admin-galeria-form.component.html',
  styleUrls: ['./admin-galeria-form.component.scss'],
  providers: [MessageService]
})
export class AdminGaleriaFormComponent implements OnInit {
  galeriaForm: FormGroup;
  isEdit = false;
  galeriaId?: number;
  imagensPreview: string[] = [];
  novasImagens: File[] = [];
  imagensParaRemover: string[] = [];

  constructor(
    private fb: FormBuilder,
    private galeriaService: GaleriaService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.galeriaForm = this.fb.group({
      titulo: ['', Validators.required],
      conteudo: [''],
      anoLetivo: [''],
      dataPublicacao: [''],
      tags: [''],
      imagens: [[]],
      manterImagens: [true]
    });
  }

  ngOnInit(): void {
    this.galeriaId = this.route.snapshot.params['id'];
    if (this.galeriaId) {
      this.isEdit = true;
      this.carregarGaleria(this.galeriaId);
    }
  }

  carregarGaleria(id: number): void {
    this.galeriaService.getGaleriaById(id).subscribe({
      next: (galeria) => {
        this.galeriaForm.patchValue({
          titulo: galeria.titulo,
          conteudo: galeria.conteudo,
          anoLetivo: galeria.anoLetivo,
          dataPublicacao: galeria.dataPublicacao ? 
            new Date(galeria.dataPublicacao).toISOString().split('T')[0] : '',
          tags: galeria.tags?.join(', ') || '',
          imagens: galeria.imagens || []
        });
      },
      error: (err) => {
        console.error('Erro ao carregar galeria', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar galeria'
        });
      }
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.novasImagens = Array.from(files);
      this.imagensPreview = [];
      
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagensPreview.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removerNovaImagem(index: number): void {
    this.imagensPreview.splice(index, 1);
    this.novasImagens.splice(index, 1);
  }

  removerImagemExistente(imagemUrl: string): void {
    this.imagensParaRemover.push(imagemUrl);
    const imagens = this.galeriaForm.value.imagens.filter((img: string) => img !== imagemUrl);
    this.galeriaForm.patchValue({ imagens });
  }

  onSubmit(): void {
    if (this.galeriaForm.valid) {
      const formValue = this.galeriaForm.value;
      const tags = formValue.tags ? 
        formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : 
        null;

      const operation = this.isEdit && this.galeriaId
        ? this.galeriaService.updateGaleria(
            this.galeriaId,
            formValue.titulo,
            formValue.conteudo,
            formValue.anoLetivo,
            formValue.dataPublicacao ? new Date(formValue.dataPublicacao) : null,
            tags,
            this.novasImagens.length > 0 ? this.novasImagens : null,
            formValue.manterImagens,
            this.imagensParaRemover.length > 0 ? this.imagensParaRemover : null
          )
        : this.galeriaService.createGaleria(
            formValue.titulo,
            formValue.conteudo,
            formValue.anoLetivo,
            formValue.dataPublicacao ? new Date(formValue.dataPublicacao) : null,
            tags,
            this.novasImagens.length > 0 ? this.novasImagens : null
          );
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Galeria ${this.isEdit ? 'atualizada' : 'criada'} com sucesso`
          });
          this.router.navigate(['/admin/galeria']);
        },
        error: (err) => {
          console.error('Erro ao salvar galeria', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao ${this.isEdit ? 'atualizar' : 'criar'} galeria`
          });
        }
      });
    } else {
      this.galeriaForm.markAllAsTouched();
    }
  }
}