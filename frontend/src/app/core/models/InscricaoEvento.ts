export interface InscricaoEvento {
    id?: number;
    eventoId: number;
    nome: string;
    email: string;
    telefone?: string;
    status: string;
    dataInscricao?: Date;
  }