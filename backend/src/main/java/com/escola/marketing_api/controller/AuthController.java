package com.escola.marketing_api.controller;




import com.escola.marketing_api.config.JwtTokenUtil;
import com.escola.marketing_api.model.Administrador;
import com.escola.marketing_api.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService; // Você precisará implementar este serviço

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String senha = credentials.get("senha");

            // Autenticação
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, senha)
            );

            // Carrega UserDetails para gerar o token
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Gera o token JWT
            String token = jwtTokenUtil.generateToken(userDetails);

            Optional<Administrador> adminOpt = adminService.findByEmail(email);
            if (adminOpt.isPresent()) {
                Administrador admin = adminOpt.get();

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", token);
                response.put("admin", Map.of(
                        "id", admin.getId(),
                        "nome", admin.getNome(),
                        "email", admin.getEmail(),
                        "role", admin.getCargo() // Certifique-se que retorna 'ADMIN' ou similar
                ));

                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Usuário não encontrado"
            ));

        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Credenciais inválidas"
            ));
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // Implementar lógica de logout se necessário (ex: blacklist do token)
        return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso"));
    }
}
