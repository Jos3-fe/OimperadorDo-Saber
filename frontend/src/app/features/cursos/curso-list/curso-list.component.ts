import { Component, OnInit } from '@angular/core';
import { Curso } from '../../../core/models/curso';
import { CursoService } from '../../../core/services/curso.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cursos',
  standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      ToastModule,
      ButtonModule,
      PaginatorModule,
      InputTextModule,
      FormsModule
    ],
  templateUrl: './curso-list.component.html',
  styleUrls: ['./curso-list.component.scss']
})
export class CursoListComponent implements OnInit {
  // Arrays para diferentes categorias de cursos
  preEscolar: Curso[] = [];
  ensinoPrimario: Curso[] = [];
  primeiroCiclo: Curso[] = [];
  segundoCiclo: Curso[] = [];
  curso: Curso | undefined;
  
  // Estados de carregamento para cada seção
  loadingPreEscolar = false;
  loadingEnsinoPrimario = false;
  loadingPrimeiroCiclo = false;
  loadingSegundoCiclo = false;
  
  error: string | null = null;

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.carregarTodosCursos();
  }

  /**
   * Carrega todos os cursos e separa por categoria
   */
  carregarTodosCursos(): void {
    this.error = null;
    
    // Carrega cursos para cada categoria
    this.buscarCursosPorCategoria('pre-escolar');
    this.buscarCursosPorCategoria('ensino-primario');
    this.buscarCursosPorCategoria('primeiro-ciclo');
    this.buscarCursosPorCategoria('segundo-ciclo');
  }

  /**
   * Busca cursos por categoria específica
   */
  buscarCursosPorCategoria(categoria: string): void {
    this.setLoadingState(categoria, true);
    this.error = null;

    this.cursoService.buscarCursosPorCategoriaCategoria(categoria).subscribe({
      next: (cursos: Curso[]) => {
        console.log(`Cursos recebidos para ${categoria}:`, cursos); // Para debug
        this.distribuirCursosPorCategoria(categoria, cursos);
        this.setLoadingState(categoria, false);
      },
      error: (error) => {
        console.error(`Erro ao carregar cursos da categoria ${categoria}:`, error);
        this.error = `Erro ao carregar cursos. Tente novamente.`;
        this.setLoadingState(categoria, false);
        this.distribuirCursosPorCategoria(categoria, []);
      }
    });
}

  /**
   * Distribui os cursos retornados para os arrays corretos
   */
  private distribuirCursosPorCategoria(categoria: string, cursos: Curso[]): void {
    switch (categoria) {
      case 'pre-escolar':
        this.preEscolar = cursos;
        break;
      case 'ensino-primario':
        this.ensinoPrimario = cursos;
        break;
      case 'primeiro-ciclo':
        this.primeiroCiclo = cursos;
        break;
      case 'segundo-ciclo':
        this.segundoCiclo = cursos;
        break;
      default:
        console.warn(`Categoria desconhecida: ${categoria}`);
    }
  }

  /**
   * Controla o estado de loading para cada categoria
   */
  private setLoadingState(categoria: string, loading: boolean): void {
    switch (categoria) {
      case 'pre-escolar':
        this.loadingPreEscolar = loading;
        break;
      case 'ensino-primario':
        this.loadingEnsinoPrimario = loading;
        break;
      case 'primeiro-ciclo':
        this.loadingPrimeiroCiclo = loading;
        break;
      case 'segundo-ciclo':
        this.loadingSegundoCiclo = loading;
        break;
      default:
        console.warn(`Categoria desconhecida para loading state: ${categoria}`);
    }
  }

  /**
   * Método para recarregar uma categoria específica
   */
  recarregarCategoria(categoria: string): void {
    this.buscarCursosPorCategoria(categoria);
  }

  /**
   * Método para recarregar todos os cursos
   */
  recarregarTodos(): void {
    this.carregarTodosCursos();
  }

  /**
   * Determina a classe CSS baseada no título do curso
   */
  getCursoClass(titulo: string): string {
    const tituloLower = (titulo || '').toLowerCase();
        
    if (tituloLower.includes('informática') || tituloLower.includes('informatica')) {
      return 'informatica';
    }
    if (tituloLower.includes('electrónica') || tituloLower.includes('electronica')) {
      return 'eletronica';
    }
    if (tituloLower.includes('contabilidade')) {
      return 'contabilidade';
    }
    if (tituloLower.includes('administração') || tituloLower.includes('administracao')) {
      return 'administracao';
    }
    if (tituloLower.includes('secretariado')) {
      return 'secretariado';
    }
    if (tituloLower.includes('construção') || tituloLower.includes('construcao')) {
      return 'construcao';
    }
    if (tituloLower.includes('gestão') || tituloLower.includes('gestao')) {
      return 'gestao';
    }
    
    return 'default';
  }

  /**
   * Verifica se há cursos em uma categoria
   */
  temCursos(categoria: string): boolean {
    switch (categoria) {
      case 'pre-escolar':
        return this.preEscolar.length > 0;
      case 'ensino-primario':
        return this.ensinoPrimario.length > 0;
      case 'primeiro-ciclo':
        return this.primeiroCiclo.length > 0;
      case 'segundo-ciclo':
        return this.segundoCiclo.length > 0;
      default:
        return false;
    }
  }

  /**
   * Obtém o número total de cursos carregados
   */
  getTotalCursos(): number {
    return this.preEscolar.length + 
           this.ensinoPrimario.length + 
           this.primeiroCiclo.length + 
           this.segundoCiclo.length;
  }

  /**
   * Verifica se alguma categoria está carregando
   */
  isCarregando(): boolean {
    return this.loadingPreEscolar || 
           this.loadingEnsinoPrimario || 
           this.loadingPrimeiroCiclo || 
           this.loadingSegundoCiclo;
  }
}