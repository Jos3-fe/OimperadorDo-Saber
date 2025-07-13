package com.escola.marketing_api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoDTO {

    private Long id;

    private String nome;

    private String filePath;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataUpload;

    private Long adminId;

    // CAMPOS QUE ESTAVAM FALTANDO:
    private String descricao;

    private Long tamanho; // Tamanho em bytes

    // Método auxiliar para formatar tamanho (opcional)
    public String getTamanhoFormatado() {
        if (tamanho == null || tamanho == 0) {
            return "0 Bytes";
        }

        String[] unidades = {"Bytes", "KB", "MB", "GB"};
        int unidadeIndex = 0;
        double tamanhoFormatado = tamanho.doubleValue();

        while (tamanhoFormatado >= 1024 && unidadeIndex < unidades.length - 1) {
            tamanhoFormatado /= 1024;
            unidadeIndex++;
        }

        return String.format("%.2f %s", tamanhoFormatado, unidades[unidadeIndex]);
    }
}