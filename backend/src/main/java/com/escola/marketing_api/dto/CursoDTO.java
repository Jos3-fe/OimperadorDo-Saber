package com.escola.marketing_api.dto;




import com.escola.marketing_api.model.Curso;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CursoDTO {
    private Long id;
    private String nome;
    private String descricaoDetalhada;
    private BigDecimal preco;
    // CAMPO CATEGORIA ADICIONADO
    private Curso.CategoriaEnsino categoria;
    private LocalDateTime lastModifiedDate;
    private LocalDateTime createdDate;
}

