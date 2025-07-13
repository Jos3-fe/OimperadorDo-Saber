package com.escola.marketing_api.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "sobreNos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SobreNos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 200, message = "Título deve ter no máximo 200 caracteres")
    @Column(nullable = false, length = 200)
    private String titulo;

    @NotBlank(message = "Conteúdo é obrigatório")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Size(max = 300, message = "Subtítulo deve ter no máximo 300 caracteres")
    @Column(length = 300)
    private String subtitulo;

    @Size(max = 500, message = "URL da imagem deve ter no máximo 500 caracteres")
    @Column(name = "img_principal", length = 500)
    private String imgPrincipal;

    @Column(columnDefinition = "TEXT")
    private String missao;

    @Column(columnDefinition = "TEXT")
    private String visao;

    @Column(columnDefinition = "TEXT")
    private String valores;

    @Column(columnDefinition = "TEXT")
    private String historia;

    @Type(io.hypersistence.utils.hibernate.type.json.JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> equipe;

    @Size(max = 100, message = "Contato principal deve ter no máximo 100 caracteres")
    @Column(name = "contato_principal", length = 100)
    private String contatoPrincipal;

    @Email(message = "Email institucional deve ser válido")
    @Size(max = 100, message = "Email institucional deve ter no máximo 100 caracteres")
    @Column(name = "email_institucional", length = 100)
    private String emailInstitucional;

    @Size(max = 20, message = "Telefone principal deve ter no máximo 20 caracteres")
    @Column(name = "telefone_principal", length = 20)
    private String telefonePrincipal;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    @Type(io.hypersistence.utils.hibernate.type.json.JsonType.class)
    @Column(name = "redes_sociais", columnDefinition = "jsonb")
    private Map<String, String> redesSociais;

    @Column(columnDefinition = "TEXT")
    private String certificacoes;

    @Column(nullable = false)
    private Boolean ativo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Administrador administrador;

    @CreatedDate
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @LastModifiedDate
    @Column(name = "ultima_modificacao")
    private LocalDateTime ultimaModificacao;
}