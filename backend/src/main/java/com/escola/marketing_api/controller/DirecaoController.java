package com.escola.marketing_api.controller;

import com.escola.marketing_api.dto.DirecaoDTO;
import com.escola.marketing_api.service.DirecaoService;
import com.escola.marketing_api.service.FileUploadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/direcao")
@CrossOrigin(origins = "*")
public class DirecaoController {

    @Autowired
    private DirecaoService direcaoService;

    @Autowired
    private FileUploadService fileUploadService;

    // Público - Listar todos
    @GetMapping
    public ResponseEntity<List<DirecaoDTO>> getAllDirecao() {
        List<DirecaoDTO> direcao = direcaoService.findAll();
        return ResponseEntity.ok(direcao);
    }

    // Público - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<DirecaoDTO> getDirecaoById(@PathVariable Long id) {
        DirecaoDTO direcao = direcaoService.findById(id);
        return ResponseEntity.ok(direcao);
    }

    // Admin - Criar membro COM imagem
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DirecaoDTO> createDirecao(
            @RequestParam("nome") String nome,
            @RequestParam("cargo") String cargo,
            @RequestParam(value = "detalhes", required = false) String detalhes,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        try {
            DirecaoDTO direcaoDTO = new DirecaoDTO();
            direcaoDTO.setNome(nome);
            direcaoDTO.setCargo(cargo);
            direcaoDTO.setDetalhes(detalhes);

            // Upload da imagem se fornecida
            if (imagem != null && !imagem.isEmpty()) {
                String imageUrl = fileUploadService.uploadImage(imagem);
                direcaoDTO.setImgUrl(imageUrl);
            }

            DirecaoDTO novaDirecao = direcaoService.save(direcaoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaDirecao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Atualizar membro COM imagem
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DirecaoDTO> updateDirecao(
            @PathVariable Long id,
            @RequestParam("nome") String nome,
            @RequestParam("cargo") String cargo,
            @RequestParam(value = "detalhes", required = false) String detalhes,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestParam(value = "manterImagem", defaultValue = "true") boolean manterImagem) {

        try {
            // Buscar membro atual
            DirecaoDTO direcaoAtual = direcaoService.findById(id);

            DirecaoDTO direcaoDTO = new DirecaoDTO();
            direcaoDTO.setNome(nome);
            direcaoDTO.setCargo(cargo);
            direcaoDTO.setDetalhes(detalhes);

            // Lógica para imagem
            if (imagem != null && !imagem.isEmpty()) {
                // Nova imagem fornecida - deletar a anterior se existir
                if (direcaoAtual.getImgUrl() != null) {
                    fileUploadService.deleteImage(direcaoAtual.getImgUrl());
                }
                String imageUrl = fileUploadService.uploadImage(imagem);
                direcaoDTO.setImgUrl(imageUrl);
            } else if (manterImagem) {
                // Manter imagem atual
                direcaoDTO.setImgUrl(direcaoAtual.getImgUrl());
            } else {
                // Remover imagem
                if (direcaoAtual.getImgUrl() != null) {
                    fileUploadService.deleteImage(direcaoAtual.getImgUrl());
                }
                direcaoDTO.setImgUrl(null);
            }

            DirecaoDTO direcaoAtualizada = direcaoService.update(id, direcaoDTO);
            return ResponseEntity.ok(direcaoAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Deletar membro
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDirecao(@PathVariable Long id) {
        // Buscar e deletar imagem antes de deletar o registro
        try {
            DirecaoDTO direcao = direcaoService.findById(id);
            if (direcao.getImgUrl() != null) {
                fileUploadService.deleteImage(direcao.getImgUrl());
            }
        } catch (Exception e) {
            // Continua com a deleção mesmo se não conseguir deletar a imagem
        }

        direcaoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Admin - Upload apenas de imagem
    @PostMapping("/admin/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadImage(@RequestParam("imagem") MultipartFile imagem) {
        try {
            String imageUrl = fileUploadService.uploadImage(imagem);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro no upload: " + e.getMessage());
        }
    }
}