export interface GaleriaDTO {
  id?: number;
  titulo: string;
  conteudo?: string;
  anoLetivo?: string;
  dataPublicacao?: Date;
  tags?: string[];
  imagens?: string[];
  slug?: string;
}