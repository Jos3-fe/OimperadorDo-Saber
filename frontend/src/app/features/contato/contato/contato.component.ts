import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MensagemService } from '../../../core/services/mensagem.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Curso } from '../../../core/models/curso';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent implements OnInit{

  curso: Curso | undefined;

  Math = Math;
  totalPages = 0;
  currentPage = 1;
  itemsPerPage = 10;

  contatoForm: FormGroup;
  loading = false;

  getPaginas(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  constructor(
    private fb: FormBuilder,
    private mensagemService: MensagemService,
    private toastr: ToastrService
  ) {
    this.contatoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.maxLength(20)]],
      assunto: ['', [Validators.required, Validators.maxLength(100)]],
      mensagem: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
   // this.carregarMensagens();
  }

  onSubmit(): void {
    if (this.contatoForm.invalid) {
      this.toastr.warning('Por favor, preencha todos os campos obrigatórios corretamente', 'Formulário inválido');
      return;
    }

    this.loading = true;
    const mensagem = this.contatoForm.value;

    this.mensagemService.enviarMensagem(mensagem).subscribe({
      next: () => {
        this.toastr.success('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'Sucesso');
        this.contatoForm.reset();
      },
      error: (err) => {
        this.toastr.error('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.', 'Erro');
        console.error('Erro ao enviar mensagem:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


}
