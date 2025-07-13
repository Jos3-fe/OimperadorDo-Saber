export interface SobreNos {
    id?: number;
    titulo: string;
    conteudo: string;
    subtitulo?: string;
    imgPrincipal?: string;
    missao?: string;
    visao?: string;
    valores?: string;
    historia?: string;
    equipe?: any[];
    contatoPrincipal?: string;
    emailInstitucional?: string;
    telefonePrincipal?: string;
    endereco?: string;
    redesSociais?: any;
    certificacoes?: string;
    ativo: boolean;
    adminId?: number;
    dataCriacao?: Date;
    ultimaModificacao?: Date;
}
