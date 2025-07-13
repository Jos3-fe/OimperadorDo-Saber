import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DirecaoService } from '../../../../../core/services/direcao.service';

@Component({
  selector: 'app-admin-direcao-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './admin-direcao-form.component.html',
  styleUrls: ['./admin-direcao-form.component.scss'],
  providers: [MessageService]
})
export class AdminDirecaoFormComponent implements OnInit {
  direcaoForm: FormGroup;
  isEdit = false;
  membroId?: number;
  imagemPreview?: string;

  selectedFile: File | null = null; // Em vez de File | undefined

  constructor(
    private fb: FormBuilder,
    private direcaoService: DirecaoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.direcaoForm = this.fb.group({
      nome: ['', Validators.required],
      cargo: ['', Validators.required],
      detalhes: [''],
      imgUrl: [null],
      manterImagem: [true] // Default true para manter imagem existente em edição
    });
  }

  ngOnInit(): void {
    this.membroId = this.route.snapshot.params['id'];
    if (this.membroId) {
      this.isEdit = true;
      this.carregarMembro(this.membroId);
    }
  }

  carregarMembro(id: number): void {
    this.direcaoService.getDirecaoById(id).subscribe({
      next: (membro) => {
        this.direcaoForm.patchValue(membro);
        if (membro.imgUrl) {
          this.imagemPreview = membro.imgUrl;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar membro', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar membro da direção'
        });
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Criar pré-visualização
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      // Marcar para não manter imagem atual (em caso de edição)
      if (this.isEdit) {
        this.direcaoForm.patchValue({ manterImagem: false });
      }
    }
  }

  onSubmit(): void {
    if (this.direcaoForm.valid) {
      const formData = new FormData();
      formData.append('nome', this.direcaoForm.value.nome);
      formData.append('cargo', this.direcaoForm.value.cargo);
      if (this.direcaoForm.value.detalhes) {
        formData.append('detalhes', this.direcaoForm.value.detalhes);
      }
      
      // Adicionar imagem se foi selecionada
      if (this.selectedFile) {
        formData.append('imagem', this.selectedFile);
      }
      
      // Adicionar manterImagem apenas em edição
      if (this.isEdit) {
        formData.append('manterImagem', this.direcaoForm.value.manterImagem.toString());
      }

      const operation = this.isEdit && this.membroId
        ? this.direcaoService.updateDirecao(this.membroId, 
            this.direcaoForm.value.nome,
            this.direcaoForm.value.cargo,
            this.direcaoForm.value.detalhes,
            this.selectedFile,
            this.direcaoForm.value.manterImagem)
        : this.direcaoService.createDirecao(
            this.direcaoForm.value.nome,
            this.direcaoForm.value.cargo,
            this.direcaoForm.value.detalhes,
            this.selectedFile);
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Membro ${this.isEdit ? 'atualizado' : 'criado'} com sucesso`
          });
          this.router.navigate(['/admin/direcao']);
        },
        error: (err) => {
          console.error('Erro ao salvar membro', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao ${this.isEdit ? 'atualizar' : 'criar'} membro`
          });
        }
      });
    } else {
      this.direcaoForm.markAllAsTouched();
    }
  }
}