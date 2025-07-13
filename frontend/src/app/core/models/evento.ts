export interface Evento {
    id?: number;
  titulo: string;
  descricao: string;
  descricaoDetalhada?: string;
  imgUrl?: string;
  dataEvento: Date;
  dataFim?: Date;
  local: string;
  maxParticipantes: number;
  participantesInscritos: number;
  preco: number;
  tipo: string;
  categoria: string;
  palestrante: string;
  ativo: boolean;
  destaque: boolean;
  requerInscricao: boolean;
  adminId?: number;
  dataCriacao?: Date;
  ultimaModificacao?: Date;
}
