export interface Mensagem {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  assunto?: string;
  mensagem: string;
  dataCriacao?: Date;
  dataResposta?: Date;
}
