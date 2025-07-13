package com.escola.marketing_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GaleriaDTO {

    private Long id;

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 200, message = "Título deve ter no máximo 200 caracteres")
    private String titulo;

    private String slug;

    @Size(max = 5000, message = "Conteúdo deve ter no máximo 5000 caracteres")
    private String conteudo;

    @Size(max = 50, message = "Ano letivo deve ter no máximo 50 caracteres")
    private String anoLetivo;

    private LocalDate dataPublicacao;

    private List<String> imagens;

    private List<String> tags;

    // Campos de auditoria
    private LocalDateTime dataCriacao;

    private LocalDateTime ultimaModificacao;
}