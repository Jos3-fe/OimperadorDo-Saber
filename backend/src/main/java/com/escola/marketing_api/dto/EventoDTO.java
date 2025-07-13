package com.escola.marketing_api.dto;

import com.escola.marketing_api.model.Evento;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String descricaoDetalhada;
    private String imgUrl;
    private LocalDateTime dataEvento;
    private LocalDateTime dataFim;
    private String local;
    private Integer maxParticipantes;
    private Integer participantesInscritos;
    private BigDecimal preco;
    private String categoria;
    private String palestrante;
    private Boolean ativo;
    private Boolean destaque;
    private Boolean requerInscricao;
    private Long adminId;
    private LocalDateTime dataCriacao;
    private LocalDateTime ultimaModificacao;
}
