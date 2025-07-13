export interface InscricaoCurso {
    id?: number;
    cursoId: number;
    nome: string;
    email: string;
    telefone?: string;
    status: string;
    dataInscricao?: Date;
  }