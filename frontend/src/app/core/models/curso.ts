export interface Curso {
  id?: number;
  nome: string;
  descricaoDetalhada?: string;
  preco?: number;
  categoria?: CategoriaEnsino;
  createdDate?: Date;
  lastModifiedDate?: Date;
}

export enum CategoriaEnsino {
  PRE_ESCOLAR = 'PRE_ESCOLAR',
  ENSINO_PRIMARIO = 'ENSINO_PRIMARIO', 
  PRIMEIRO_CICLO = 'PRIMEIRO_CICLO',
  SEGUNDO_CICLO = 'SEGUNDO_CICLO'
}

export const CATEGORIAS_MAP: Record<CategoriaEnsino, CategoriaInfo> = {
  [CategoriaEnsino.PRE_ESCOLAR]: {
    codigo: 'pre-escolar',
    descricao: 'Pré Escolar'
  },
  [CategoriaEnsino.ENSINO_PRIMARIO]: {
    codigo: 'ensino-primario', 
    descricao: 'Ensino Primário'
  },
  [CategoriaEnsino.PRIMEIRO_CICLO]: {
    codigo: 'primeiro-ciclo',
    descricao: 'I Ciclo'
  },
  [CategoriaEnsino.SEGUNDO_CICLO]: {
    codigo: 'segundo-ciclo',
    descricao: 'II Ciclo'
  }
};

export interface CategoriaInfo {
  codigo: string;
  descricao: string;
}
