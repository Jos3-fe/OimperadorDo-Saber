import { Admin } from "./admin";
 
export interface NoticiaDTO {
  id?: number;
  titulo: string;
  conteudo: string;
  imgUrl?: string;
  dataPublicacao?: Date;
  adminId?: number;
}