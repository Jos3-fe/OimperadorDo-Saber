package com.escola.marketing_api.service;

import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Administrador;
import com.escola.marketing_api.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdministradorRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Administrador> findAll() {
        return adminRepository.findAll();
    }

    public List<Administrador> findAtivos() {
        return adminRepository.findByAtivoTrue();
    }

    public Administrador findById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado com ID: " + id));
    }

    public Optional<Administrador> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Transactional
    public Administrador save(Administrador admin) {
        admin.setSenha(passwordEncoder.encode(admin.getSenha()));
        admin.setDataCriacao(LocalDateTime.now());
        admin.setUltimaModificacao(LocalDateTime.now());
        return adminRepository.save(admin);
    }

   /* public Administrador save(Administrador admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new IllegalArgumentException("Email já está em uso");
        }

        admin.setSenha(passwordEncoder.encode(admin.getSenha()));
        admin.setDataCriacao(LocalDateTime.now());
        admin.setUltimaModificacao(LocalDateTime.now());
        return adminRepository.save(admin);
    }*/

    public Administrador update(Long id, Administrador adminDetails) {
        Administrador admin = findById(id);

        if (!admin.getEmail().equals(adminDetails.getEmail()) &&
                adminRepository.existsByEmail(adminDetails.getEmail())) {
            throw new IllegalArgumentException("Email já está em uso");
        }

        admin.setNome(adminDetails.getNome());
        admin.setEmail(adminDetails.getEmail());
        admin.setCargo(adminDetails.getCargo());
        admin.setAtivo(adminDetails.getAtivo());
        admin.setRole(adminDetails.getRole()); // Adicione esta linha
        admin.setUltimaModificacao(LocalDateTime.now());

        if (adminDetails.getSenha() != null && !adminDetails.getSenha().isEmpty()) {
            admin.setSenha(passwordEncoder.encode(adminDetails.getSenha()));
        }

        return adminRepository.save(admin);
    }

    public void alterarSenha(Long id, String novaSenha) {
        Administrador admin = findById(id);
        admin.setSenha(passwordEncoder.encode(novaSenha));
        admin.setUltimaModificacao(LocalDateTime.now());
        adminRepository.save(admin);
    }

    public void toggleAtivo(Long id) {
        Administrador admin = findById(id);
        admin.setAtivo(!admin.getAtivo());
        admin.setUltimaModificacao(LocalDateTime.now());
        adminRepository.save(admin);
    }

    public void deleteById(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new ResourceNotFoundException("Administrador não encontrado com ID: " + id);
        }
        adminRepository.deleteById(id);
    }

    public boolean validarCredenciais(String email, String senha) {
        Optional<Administrador> admin = findByEmail(email);
        return admin.isPresent() &&
                admin.get().getAtivo() &&
                passwordEncoder.matches(senha, admin.get().getSenha());
    }
}

