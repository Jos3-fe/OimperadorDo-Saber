package com.escola.marketing_api.dto;




import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private final String type = "Bearer";
    private String token;
    private String email;
    private String nome;
}
