package com.escola.marketing_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
    @Column(nullable = false, length = 200)
    private String nome;

    @Column(name = "descricao_detalhada", columnDefinition = "TEXT")
    private String descricaoDetalhada;

    @PositiveOrZero(message = "Preço deve ser positivo ou zero")
    @Column(precision = 10, scale = 2)
    private BigDecimal preco;

    // NOVO CAMPO CATEGORIA
    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", length = 50)
    private CategoriaEnsino categoria;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    // Enum para as categorias
    public enum CategoriaEnsino {
        PRE_ESCOLAR("pre-escolar", "Pré Escolar"),
        ENSINO_PRIMARIO("ensino-primario", "Ensino Primário"),
        PRIMEIRO_CICLO("primeiro-ciclo", "I Ciclo"),
        SEGUNDO_CICLO("segundo-ciclo", "II Ciclo");

        private final String codigo;
        private final String descricao;

        CategoriaEnsino(String codigo, String descricao) {
            this.codigo = codigo;
            this.descricao = descricao;
        }

        public String getCodigo() {
            return codigo;
        }

        public String getDescricao() {
            return descricao;
        }

        public static CategoriaEnsino fromCodigo(String codigo) {
            for (CategoriaEnsino categoria : values()) {
                if (categoria.codigo.equals(codigo)) {
                    return categoria;
                }
            }
            throw new IllegalArgumentException("Categoria não encontrada: " + codigo);
        }
    }



}




