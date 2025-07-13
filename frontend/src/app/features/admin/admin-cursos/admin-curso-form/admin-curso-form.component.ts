import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../../core/services/curso.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CategoriaEnsino, CATEGORIAS_MAP } from '../../../../core/models/curso';


@Component({
  selector: 'app-admin-curso-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    DropdownModule
  ],
  templateUrl: './admin-curso-form.component.html',
  styleUrls: ['./admin-curso-form.component.scss'],
  providers: [MessageService]
})
export class AdminCursoFormComponent implements OnInit {
  cursoForm: FormGroup;
  isEdit = false;
  cursoId?: number;
  categorias: { label: string, value: CategoriaEnsino }[] = [];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.cursoForm = this.fb.group({
      nome: ['', Validators.required],
      descricaoDetalhada: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      categoria: [null, Validators.required]
    });

    // Preparar opções para o dropdown
    this.categorias = Object.values(CategoriaEnsino).map(categoria => ({
      label: CATEGORIAS_MAP[categoria].descricao,
      value: categoria
    }));
  }

  ngOnInit(): void {
    this.cursoId = this.route.snapshot.params['id'];
    if (this.cursoId) {
      this.isEdit = true;
      this.carregarCurso(this.cursoId);
    }
  }

  carregarCurso(id: number): void {
    this.cursoService.getCurso(id).subscribe({
      next: (curso) => this.cursoForm.patchValue(curso),
      error: (err) => console.error('Erro ao carregar curso', err)
    });
  }

  
  


  onSubmit(): void {
  if (this.cursoForm.invalid) {
    this.cursoForm.markAllAsTouched();
    return;
  }

  const formValue = this.cursoForm.value;
  console.log('Dados sendo enviados:', formValue); // Para debug

  const operation = this.isEdit && this.cursoId
    ? this.cursoService.updateCurso(this.cursoId, formValue)
    : this.cursoService.createCurso(formValue);
  
  operation.subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Curso ${this.isEdit ? 'atualizado' : 'criado'} com sucesso`,
        life: 3000
      });
      this.router.navigate(['/admin/cursos']);
    },
    error: (err) => {
      console.error('Erro completo:', err);
      let detail = 'Erro desconhecido';
      
      if (err.error?.message) {
        detail = err.error.message;
      } else if (Array.isArray(err.error)) {
        detail = err.error.join(', ');
      } else if (typeof err.error === 'object') {
        detail = Object.values(err.error).join(', ');
      }
      
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: detail,
        life: 5000
      });
    }
  });
}



}