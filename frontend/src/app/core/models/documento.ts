import { Admin } from "./admin";

export interface DocumentoDTO {
  id: number;
  nome: string;
  filePath: string;
  descricao?: string;
  dataUpload?: string;
  tamanho: number; 
  admin?: Admin;
}