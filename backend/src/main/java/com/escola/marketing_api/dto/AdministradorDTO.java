package com.escola.marketing_api.dto;

import com.escola.marketing_api.model.Administrador;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdministradorDTO {
    private Long id;
    private String nome;
    private String email;
    private String cargo;
    private Boolean ativo;
    private LocalDateTime dataCriacao;
    private LocalDateTime ultimaModificacao;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Administrador.Role role;

    @NotBlank
    @Size(min = 6)
    private String senha;

    public static AdministradorDTO fromEntity(Administrador admin) {
        AdministradorDTO dto = new AdministradorDTO();
        dto.setId(admin.getId());
        dto.setNome(admin.getNome());
        dto.setEmail(admin.getEmail());
        dto.setCargo(admin.getCargo());
        dto.setAtivo(admin.getAtivo());
        dto.setDataCriacao(admin.getDataCriacao());
        dto.setUltimaModificacao(admin.getUltimaModificacao());
        dto.setRole(admin.getRole()); // Adicione esta linha
        return dto;
    }
}
