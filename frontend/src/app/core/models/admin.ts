export interface Admin {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  cargo?: string;
  ativo: boolean;
  role?: string;
  dataCriacao?: Date;
  ultimaModificacao?: Date;
}
