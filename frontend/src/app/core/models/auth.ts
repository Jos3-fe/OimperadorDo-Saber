// src/app/core/models/auth.ts
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  admin?: {
    id: number;
    email: string;
    nome: string;
    role: string;
    senha?: string;
    cargo?: string;
    ativo: boolean;
    dataCriacao?: Date;
    ultimaModificacao?: Date;
    // Adicione outros campos conforme seu backend
  };
}