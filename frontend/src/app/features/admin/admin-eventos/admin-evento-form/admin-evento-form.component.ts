import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventoService } from '../../../../core/services/evento.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-evento-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './admin-evento-form.component.html',
  styleUrls: ['./admin-evento-form.component.scss'],
  providers: [MessageService]
})
export class AdminEventoFormComponent implements OnInit {
  eventoForm: FormGroup;
  isEdit = false;
  eventoId?: number;
  imagemPreview?: string;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      descricaoDetalhada: [''],
      dataEvento: ['', Validators.required],
      dataFim: [''],
      local: [''],
      preco: [0],
      imgUrl: [null],
      manterImagem: [true]
    });
  }

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.params['id'];
    if (this.eventoId) {
      this.isEdit = true;
      this.carregarEvento(this.eventoId);
    }
  }

  carregarEvento(id: number): void {
    this.eventoService.getEventoById(id).subscribe({
      next: (evento) => {
        // Formatar datas para o input datetime-local
        const dataEvento = this.formatDateForInput(evento.dataEvento);
        const dataFim = evento.dataFim ? this.formatDateForInput(evento.dataFim) : '';
        
        this.eventoForm.patchValue({
          titulo: evento.titulo,
          descricao: evento.descricao,
          descricaoDetalhada: evento.descricaoDetalhada,
          dataEvento: dataEvento,
          dataFim: dataFim,
          local: evento.local,
          preco: evento.preco,
          imgUrl: evento.imgUrl
        });
        
        if (evento.imgUrl) {
          this.imagemPreview = evento.imgUrl;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar evento', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar evento'
        });
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
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
        this.eventoForm.patchValue({ manterImagem: false });
      }
    } else {
      this.imagemPreview = undefined;
    }
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      const formValue = this.eventoForm.value;
      
      const operation = this.isEdit && this.eventoId
        ? this.eventoService.updateEvento(
            this.eventoId,
            formValue.titulo,
            formValue.descricao,
            formValue.descricaoDetalhada,
            formValue.dataEvento,
            formValue.dataFim || null,
            formValue.local || null,
            formValue.preco || 0,
            this.selectedFile,
            formValue.manterImagem
          )
        : this.eventoService.createEvento(
            formValue.titulo,
            formValue.descricao,
            formValue.descricaoDetalhada,
            formValue.dataEvento,
            formValue.dataFim || null,
            formValue.local || null,
            formValue.preco || 0,
            this.selectedFile
          );
      
      operation.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Evento ${this.isEdit ? 'atualizado' : 'criado'} com sucesso`
          });
          this.router.navigate(['/admin/eventos']);
        },
        error: (err) => {
          console.error('Erro ao salvar evento', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao ${this.isEdit ? 'atualizar' : 'criar'} evento`
          });
        }
      });
    } else {
      this.eventoForm.markAllAsTouched();
    }
  }
}