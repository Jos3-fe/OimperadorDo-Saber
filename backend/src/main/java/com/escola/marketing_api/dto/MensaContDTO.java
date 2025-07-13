package com.escola.marketing_api.dto;

import com.escola.marketing_api.model.MensaCont;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MensaContDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String assunto;
    private String mensagem;
    private String interesse;
    private String status; // Alterado para String para representar o nome do Enum
    private Long adminResponsavelId; // ID do administrador responsável
    private String adminResponsavelNome; // Adicionado para exibir o nome do administrador
    private LocalDateTime dataCriacao;
    private LocalDateTime dataResposta;
    private String resposta;
}