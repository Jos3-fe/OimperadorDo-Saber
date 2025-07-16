package com.escola.marketing_api.controller;

import com.escola.marketing_api.dto.NoticiaDTO;
import com.escola.marketing_api.service.NoticiaService;
import com.escola.marketing_api.service.FileUploadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "*")
public class NoticiaController {

    @Autowired
    private NoticiaService noticiaService;

    @Autowired
    private FileUploadService fileUploadService;

    // Público - Listar paginado
    @GetMapping("/paginated")
    public ResponseEntity<Page<NoticiaDTO>> getNoticiasPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataPublicacao") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<NoticiaDTO> noticias = noticiaService.findAllPaginated(pageable);
        return ResponseEntity.ok(noticias);
    }

    // Público - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<NoticiaDTO> getNoticiaById(@PathVariable Long id) {
        NoticiaDTO noticia = noticiaService.findById(id);
        return ResponseEntity.ok(noticia);
    }

    // Admin - Criar notícia COM imagem
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NoticiaDTO> createNoticia(
            @RequestParam("titulo") String titulo,
            @RequestParam("conteudo") String conteudo,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestHeader("admin-id") Long adminId) {

        try {
            NoticiaDTO noticiaDTO = new NoticiaDTO();
            noticiaDTO.setTitulo(titulo);
            noticiaDTO.setConteudo(conteudo);

            // Upload da imagem se fornecida
            if (imagem != null && !imagem.isEmpty()) {
                String imageUrl = fileUploadService.uploadImage(imagem);
                noticiaDTO.setImgUrl(imageUrl);
            }

            NoticiaDTO novaNoticia = noticiaService.save(noticiaDTO, adminId);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaNoticia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Atualizar notícia COM imagem
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NoticiaDTO> updateNoticia(
            @PathVariable Long id,
            @RequestParam("titulo") String titulo,
            @RequestParam("conteudo") String conteudo,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestParam(value = "manterImagem", defaultValue = "true") boolean manterImagem) {

        try {
            // Buscar notícia atual
            NoticiaDTO noticiaAtual = noticiaService.findById(id);

            NoticiaDTO noticiaDTO = new NoticiaDTO();
            noticiaDTO.setTitulo(titulo);
            noticiaDTO.setConteudo(conteudo);

            // Lógica para imagem
            if (imagem != null && !imagem.isEmpty()) {
                // Nova imagem fornecida - deletar a anterior se existir
                if (noticiaAtual.getImgUrl() != null) {
                    fileUploadService.deleteImage(noticiaAtual.getImgUrl());
                }
                String imageUrl = fileUploadService.uploadImage(imagem);
                noticiaDTO.setImgUrl(imageUrl);
            } else if (manterImagem) {
                // Manter imagem atual
                noticiaDTO.setImgUrl(noticiaAtual.getImgUrl());
            } else {
                // Remover imagem
                if (noticiaAtual.getImgUrl() != null) {
                    fileUploadService.deleteImage(noticiaAtual.getImgUrl());
                }
                noticiaDTO.setImgUrl(null);
            }

            NoticiaDTO noticiaAtualizada = noticiaService.update(id, noticiaDTO);
            return ResponseEntity.ok(noticiaAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Deletar notícia
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNoticia(@PathVariable Long id) {
        // Buscar e deletar imagem antes de deletar o registro
        try {
            NoticiaDTO noticia = noticiaService.findById(id);
            if (noticia.getImgUrl() != null) {
                fileUploadService.deleteImage(noticia.getImgUrl());
            }
        } catch (Exception e) {
            // Continua com a deleção mesmo se não conseguir deletar a imagem
        }

        noticiaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Admin - Upload apenas de imagema
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
