export interface EventoDTO {
  id?: number;
  titulo: string;
  descricao?: string;
  descricaoDetalhada?: string;
  imgUrl?: string;
  dataEvento: string;
  dataFim?: string;
  local?: string;
  preco?: number;
}