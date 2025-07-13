package com.escola.marketing_api.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticiaDTO {
    private Long id;
    private String titulo;
    private String conteudo;
    private String imgUrl;
    private String categoria; // "NOTICIA", "COMUNICADO"
    private boolean destaque;
    private LocalDateTime dataPublicacao;
    private Long adminId;
    // Getters e Setters


}