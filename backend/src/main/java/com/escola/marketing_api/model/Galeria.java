package com.escola.marketing_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "galeria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Galeria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 200, message = "Título deve ter no máximo 200 caracteres")
    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(unique = true, length = 300)
    private String slug;

    @Size(max = 5000, message = "Conteúdo deve ter no máximo 5000 caracteres")
    @Column(length = 5000)
    private String conteudo;

    @Size(max = 50, message = "Ano letivo deve ter no máximo 50 caracteres")
    @Column(name = "ano_letivo", length = 50)
    private String anoLetivo;

    @Column(name = "data_publicacao")
    private LocalDate dataPublicacao;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "galeria_imagens", joinColumns = @JoinColumn(name = "galeria_id"))
    @Column(name = "imagem_url", length = 500)
    private List<String> imagens = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "galeria_tags", joinColumns = @JoinColumn(name = "galeria_id"))
    @Column(name = "tag", length = 50)
    private List<String> tags = new ArrayList<>();

    @CreatedDate
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @LastModifiedDate
    @Column(name = "ultima_modificacao")
    private LocalDateTime ultimaModificacao;

    @PrePersist
    protected void onCreate() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }
        ultimaModificacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ultimaModificacao = LocalDateTime.now();
    }
}