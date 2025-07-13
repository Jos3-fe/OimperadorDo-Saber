import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { AdminService } from '../../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-admins-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule
  ],
  templateUrl: './admin-admins-form.component.html',
  styleUrls: ['./admin-admins-form.component.scss'],
  providers: [MessageService]
})
export class AdminAdminsFormComponent implements OnInit {
  adminForm: FormGroup;
  isEdit = false;
  adminId?: number;
  roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Secretaria', value: 'SECRETARIA' }
  ];

  cargos = [
     { label: 'Administrador', value: 'ADMIN' },
    { label: 'Secretaria', value: 'SECRETARIA' }
  ];



  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.adminForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6)]],
      cargo: ['', Validators.required],
      ativo: [true],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.adminId = this.route.snapshot.params['id'];
    if (this.adminId) {
      this.isEdit = true;
      this.carregarAdministrador(this.adminId);
      // Remove a validação obrigatória da senha para edição
      this.adminForm.get('senha')?.clearValidators();
      this.adminForm.get('senha')?.updateValueAndValidity();
    } else {
      // Para novo admin, senha é obrigatória
      this.adminForm.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.adminForm.get('senha')?.updateValueAndValidity();
    }
  }

  carregarAdministrador(id: number): void {
    this.adminService.getAdministrador(id).subscribe({
      next: (admin) => {
        this.adminForm.patchValue(admin);
        // Remove a senha para não exibir o hash
        this.adminForm.get('senha')?.setValue('');
      },
      error: (err) => {
        console.error('Erro ao carregar administrador', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados do administrador'
        });
      }
    });
  }


  onSubmit(): void {
  if (this.adminForm.invalid) {
    this.adminForm.markAllAsTouched();
    return;
  }

  const formValue = this.adminForm.value;
  
  // Se for edição e a senha estiver vazia, remove o campo senha
  if (this.isEdit && (formValue.senha === '' || formValue.senha === null)) {
    delete formValue.senha;
  }

  const operation = this.isEdit && this.adminId
    ? this.adminService.atualizarAdministrador(this.adminId, formValue)
    : this.adminService.criarAdministrador(formValue);
  
  operation.subscribe({
    next: (res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Administrador ${this.isEdit ? 'atualizado' : 'criado'} com sucesso`
      });
      this.router.navigate(['/admin/admins']);
    },
    error: (err) => {
      console.error('Erro:', err);
      let errorMsg = 'Erro ao processar a solicitação';
      
      if (err.error && err.error.message) {
        errorMsg = err.error.message;
      } else if (err.status === 500) {
        errorMsg = 'Erro interno no servidor';
      }
      
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMsg
      });
    }
  });
}



}