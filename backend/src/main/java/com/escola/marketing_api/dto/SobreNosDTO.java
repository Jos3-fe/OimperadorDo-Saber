package com.escola.marketing_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SobreNosDTO {
    private Long id;
    private String titulo;
    private String conteudo;
    private String subtitulo;
    private String imgPrincipal;
    private String missao;
    private String visao;
    private String valores;
    private String historia;
    private Map<String, Object> equipe;
    private String contatoPrincipal;
    private String emailInstitucional;
    private String telefonePrincipal;
    private String endereco;
    private Map<String, String> redesSociais;
    private String certificacoes;
    private Boolean ativo;
    private Long administradorId;
    private LocalDateTime dataCriacao;
    private LocalDateTime ultimaModificacao;
}
