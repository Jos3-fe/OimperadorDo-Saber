package com.escola.marketing_api.controller;



import com.escola.marketing_api.dto.AdministradorDTO;
import com.escola.marketing_api.model.Administrador;
import com.escola.marketing_api.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/administradores")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdministradorDTO>> getAllAdmins() {
        List<AdministradorDTO> admins = adminService.findAll()
                .stream()
                .map(AdministradorDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(admins);
    }



    @GetMapping("/administradores/ativos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdministradorDTO>> getAdminsAtivos() {
        List<AdministradorDTO> admins = adminService.findAtivos()
                .stream()
                .map(AdministradorDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(admins);
    }


    @GetMapping("/administradores/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdministradorDTO> getAdminById(@PathVariable Long id) {
        Administrador admin = adminService.findById(id);
        return ResponseEntity.ok(AdministradorDTO.fromEntity(admin));
    }


    @PostMapping("/administradores")
   @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody AdministradorDTO adminDTO) {
        try {
            Administrador novoAdmin = new Administrador();
            novoAdmin.setNome(adminDTO.getNome());
            novoAdmin.setEmail(adminDTO.getEmail());
            novoAdmin.setSenha(adminDTO.getSenha());
            novoAdmin.setCargo(adminDTO.getCargo());
            novoAdmin.setRole(adminDTO.getRole());
            novoAdmin.setAtivo(true);

            Administrador adminSalvo = adminService.save(novoAdmin);
            return ResponseEntity.status(HttpStatus.CREATED).body(adminSalvo);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Email já está em uso");
        }
    }

    // Adicione este método ao seu AdminController
    @PostMapping("/primeiro-administrador")
    public ResponseEntity<?> criarPrimeiroAdministrador(@Valid @RequestBody AdministradorDTO adminDTO) {
        try {
            // Verifica se já existe algum administrador no banco
            List<Administrador> adminsExistentes = adminService.findAll();

            if (!adminsExistentes.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("erro", "Já existe pelo menos um administrador no sistema"));
            }

            Administrador novoAdmin = new Administrador();
            novoAdmin.setNome(adminDTO.getNome());
            novoAdmin.setEmail(adminDTO.getEmail());
            novoAdmin.setSenha(adminDTO.getSenha());
            novoAdmin.setCargo(adminDTO.getCargo());
            novoAdmin.setRole(Administrador.Role.ADMIN); // Força como ADMIN
            novoAdmin.setAtivo(true);

            Administrador adminSalvo = adminService.save(novoAdmin);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("sucesso", "Primeiro administrador criado com sucesso", "id", adminSalvo.getId()));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Email já está em uso"));
        }
    }


    @PutMapping("/administradores/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdministradorDTO> updateAdmin(@PathVariable Long id,
                                                        @Valid @RequestBody Administrador adminDetails) {
        Administrador existingAdmin = adminService.findById(id);

        // Copia os campos que podem ser atualizados
        existingAdmin.setNome(adminDetails.getNome());
        existingAdmin.setEmail(adminDetails.getEmail());
        existingAdmin.setCargo(adminDetails.getCargo());
        existingAdmin.setAtivo(adminDetails.getAtivo());
        existingAdmin.setRole(adminDetails.getRole()); // Atualiza a role

        Administrador adminAtualizado = adminService.update(id, existingAdmin);
        return ResponseEntity.ok(AdministradorDTO.fromEntity(adminAtualizado));
    }


    @PatchMapping("/administradores/{id}/alterar-senha")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> alterarSenha(@PathVariable Long id,
                                             @RequestBody Map<String, String> payload) {
        String novaSenha = payload.get("novaSenha");
        if (novaSenha == null || novaSenha.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        adminService.alterarSenha(id, novaSenha);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/administradores/{id}/toggle-ativo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleAtivoAdmin(@PathVariable Long id) {
        adminService.toggleAtivo(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/administradores/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para validar credenciais (usado pelo login)
    @PostMapping("/validar-credenciais")
    public ResponseEntity<Map<String, Object>> validarCredenciais(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String senha = credentials.get("senha");

        boolean valido = adminService.validarCredenciais(email, senha);

        Map<String, Object> response = Map.of(
                "valido", valido,
                "mensagem", valido ? "Credenciais válidas" : "Credenciais inválidas"
        );

        return ResponseEntity.ok(response);
    }
}

