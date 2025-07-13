import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Curso } from '../../../core/models/curso';
import { Evento } from '../../../core/models/evento';
import { CursoService } from '../../../core/services/curso.service';
import { EventoService } from '../../../core/services/evento.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, // <--- ESTA LINHA É CRÍTICA
    RouterModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  cursosDestaque: Curso[] = [];
  proximosEventos: Evento[] = [];
  loading = false;

  constructor(
    private cursoService: CursoService,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    //this.loadData();
  }

   /*
  private loadData(): void {
    this.loading = true;
    
    

    // Carregar próximos eventos
   this.eventoService.getProximosEventos().subscribe({
      next: (eventos) => {
        this.proximosEventos = eventos.slice(0, 3); // Máximo 3 eventos
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.loading = false;
      }
    });
  }*/
}