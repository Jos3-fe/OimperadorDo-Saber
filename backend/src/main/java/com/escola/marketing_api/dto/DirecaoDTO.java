package com.escola.marketing_api.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DirecaoDTO {

    private Long id; // Usado apenas em respostas (não em cadastro)
    private String nome;
    private String cargo;
    private String detalhes;
    private String imgUrl;
}
