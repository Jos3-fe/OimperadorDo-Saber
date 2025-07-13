package com.escola.marketing_api.controller;

import com.escola.marketing_api.dto.GaleriaDTO;
import com.escola.marketing_api.service.GaleriaService;
import com.escola.marketing_api.service.FileUploadService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@RestController
@RequestMapping("/api/galeria")
@CrossOrigin(origins = "*")
public class GaleriaController {

    @Autowired
    private GaleriaService galeriaService;

    @Autowired
    private FileUploadService fileUploadService;

    // Público - Listar paginado
    @GetMapping("/paginated")
    public ResponseEntity<Page<GaleriaDTO>> getGaleriasPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "dataPublicacao") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            // Validar parâmetros
            if (page < 0) page = 0;
            if (size <= 0 || size > 100) size = 12;

            // Validar campos de ordenação permitidos
            if (!isValidSortField(sortBy)) {
                sortBy = "dataPublicacao";
            }

            log.info("Buscando galerias - page: {}, size: {}, sortBy: {}, sortDir: {}",
                    page, size, sortBy, sortDir);

            Sort sort = sortDir.equalsIgnoreCase("asc") ?
                    Sort.by(sortBy).ascending() :
                    Sort.by(sortBy).descending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<GaleriaDTO> galerias = galeriaService.findAllPaginated(pageable);

            log.info("Retornando {} galerias de {}",
                    galerias.getNumberOfElements(), galerias.getTotalElements());

            return ResponseEntity.ok(galerias);
        } catch (Exception e) {
            log.error("Erro ao buscar galerias paginadas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Page.empty());
        }
    }

    private boolean isValidSortField(String sortBy) {
        return Arrays.asList("id", "titulo", "dataPublicacao", "dataCriacao", "anoLetivo")
                .contains(sortBy);
    }

    // Público - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<GaleriaDTO> getGaleriaById(@PathVariable Long id) {
        GaleriaDTO galeria = galeriaService.findById(id);
        return ResponseEntity.ok(galeria);
    }

    // Público - Buscar por slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<GaleriaDTO> getGaleriaBySlug(@PathVariable String slug) {
        GaleriaDTO galeria = galeriaService.findBySlug(slug);
        return ResponseEntity.ok(galeria);
    }

    // Público - Buscar por ano letivo
    @GetMapping("/ano/{anoLetivo}")
    public ResponseEntity<List<GaleriaDTO>> getGaleriasByAno(@PathVariable String anoLetivo) {
        List<GaleriaDTO> galerias = galeriaService.findByAnoLetivo(anoLetivo);
        return ResponseEntity.ok(galerias);
    }

    // Público - Buscar por ano letivo paginado
    @GetMapping("/ano/{anoLetivo}/paginated")
    public ResponseEntity<Page<GaleriaDTO>> getGaleriasByAnoPaginated(
            @PathVariable String anoLetivo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("dataPublicacao").descending());
        Page<GaleriaDTO> galerias = galeriaService.findByAnoLetivoPaginated(anoLetivo, pageable);
        return ResponseEntity.ok(galerias);
    }

    // Público - Buscar por tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<GaleriaDTO>> getGaleriasByTag(@PathVariable String tag) {
        List<GaleriaDTO> galerias = galeriaService.findByTag(tag);
        return ResponseEntity.ok(galerias);
    }

    // Público - Buscar por título
    @GetMapping("/search")
    public ResponseEntity<Page<GaleriaDTO>> searchGalerias(
            @RequestParam String titulo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("dataPublicacao").descending());
        Page<GaleriaDTO> galerias = galeriaService.findByTitulo(titulo, pageable);
        return ResponseEntity.ok(galerias);
    }

    // Público - Obter anos letivos disponíveis
    @GetMapping("/anos-letivos")
    public ResponseEntity<List<String>> getAnosLetivos() {
        List<String> anos = galeriaService.getAnosLetivos();
        return ResponseEntity.ok(anos);
    }

    // Público - Obter tags disponíveis
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getTags() {
        List<String> tags = galeriaService.getTags();
        return ResponseEntity.ok(tags);
    }

    // Admin - Criar galeria COM múltiplas imagens
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GaleriaDTO> createGaleria(
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "conteudo", required = false) String conteudo,
            @RequestParam(value = "anoLetivo", required = false) String anoLetivo,
            @RequestParam(value = "dataPublicacao", required = false) String dataPublicacaoStr,
            @RequestParam(value = "tags", required = false) String tagsStr,
            @RequestParam(value = "imagens", required = false) MultipartFile[] imagens) {

        try {
            GaleriaDTO galeriaDTO = new GaleriaDTO();
            galeriaDTO.setTitulo(titulo);
            galeriaDTO.setConteudo(conteudo);
            galeriaDTO.setAnoLetivo(anoLetivo);

            // Converter data de publicação
            if (dataPublicacaoStr != null && !dataPublicacaoStr.isEmpty()) {
                galeriaDTO.setDataPublicacao(LocalDate.parse(dataPublicacaoStr));
            }

            // Processar tags
            if (tagsStr != null && !tagsStr.isEmpty()) {
                List<String> tags = Arrays.stream(tagsStr.split(","))
                        .map(String::trim)
                        .filter(tag -> !tag.isEmpty())
                        .collect(Collectors.toList());
                galeriaDTO.setTags(tags);
            }

            // Upload das imagens
            List<String> imagensUrls = new ArrayList<>();
            if (imagens != null && imagens.length > 0) {
                for (MultipartFile imagem : imagens) {
                    if (imagem != null && !imagem.isEmpty()) {
                        String imageUrl = fileUploadService.uploadImage(imagem);
                        imagensUrls.add(imageUrl);
                    }
                }
            }
            galeriaDTO.setImagens(imagensUrls);

            GaleriaDTO novaGaleria = galeriaService.save(galeriaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaGaleria);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Atualizar galeria COM múltiplas imagens
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GaleriaDTO> updateGaleria(
            @PathVariable Long id,
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "conteudo", required = false) String conteudo,
            @RequestParam(value = "anoLetivo", required = false) String anoLetivo,
            @RequestParam(value = "dataPublicacao", required = false) String dataPublicacaoStr,
            @RequestParam(value = "tags", required = false) String tagsStr,
            @RequestParam(value = "novasImagens", required = false) MultipartFile[] novasImagens,
            @RequestParam(value = "manterImagens", defaultValue = "true") boolean manterImagens,
            @RequestParam(value = "imagensRemover", required = false) String imagensRemoverStr) {

        try {
            // Buscar galeria atual
            GaleriaDTO galeriaAtual = galeriaService.findById(id);

            GaleriaDTO galeriaDTO = new GaleriaDTO();
            galeriaDTO.setTitulo(titulo);
            galeriaDTO.setConteudo(conteudo);
            galeriaDTO.setAnoLetivo(anoLetivo);

            // Converter data de publicação
            if (dataPublicacaoStr != null && !dataPublicacaoStr.isEmpty()) {
                galeriaDTO.setDataPublicacao(LocalDate.parse(dataPublicacaoStr));
            } else {
                galeriaDTO.setDataPublicacao(galeriaAtual.getDataPublicacao());
            }

            // Processar tags
            if (tagsStr != null && !tagsStr.isEmpty()) {
                List<String> tags = Arrays.stream(tagsStr.split(","))
                        .map(String::trim)
                        .filter(tag -> !tag.isEmpty())
                        .collect(Collectors.toList());
                galeriaDTO.setTags(tags);
            }

            // Gerenciar imagens
            List<String> imagensFinais = new ArrayList<>();

            if (manterImagens && galeriaAtual.getImagens() != null) {
                imagensFinais.addAll(galeriaAtual.getImagens());
            }

            // Remover imagens específicas
            if (imagensRemoverStr != null && !imagensRemoverStr.isEmpty()) {
                List<String> imagensParaRemover = Arrays.asList(imagensRemoverStr.split(","));
                for (String imagemUrl : imagensParaRemover) {
                    imagensFinais.remove(imagemUrl.trim());
                    // Deletar arquivo físico
                    try {
                        fileUploadService.deleteImage(imagemUrl.trim());
                    } catch (Exception e) {
                        // Log error but continue
                    }
                }
            }

            // Adicionar novas imagens
            if (novasImagens != null && novasImagens.length > 0) {
                for (MultipartFile imagem : novasImagens) {
                    if (imagem != null && !imagem.isEmpty()) {
                        String imageUrl = fileUploadService.uploadImage(imagem);
                        imagensFinais.add(imageUrl);
                    }
                }
            }

            galeriaDTO.setImagens(imagensFinais);

            GaleriaDTO galeriaAtualizada = galeriaService.update(id, galeriaDTO);
            return ResponseEntity.ok(galeriaAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Deletar galeria
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGaleria(@PathVariable Long id) {
        // Buscar e deletar todas as imagens antes de deletar o registro
        try {
            GaleriaDTO galeria = galeriaService.findById(id);
            if (galeria.getImagens() != null && !galeria.getImagens().isEmpty()) {
                for (String imagemUrl : galeria.getImagens()) {
                    try {
                        fileUploadService.deleteImage(imagemUrl);
                    } catch (Exception e) {
                        // Log error but continue
                    }
                }
            }
        } catch (Exception e) {
            // Continua com a deleção mesmo se não conseguir deletar as imagens
        }

        galeriaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Admin - Upload múltiplo de imagens
    @PostMapping("/admin/upload-images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("imagens") MultipartFile[] imagens) {
        try {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile imagem : imagens) {
                if (imagem != null && !imagem.isEmpty()) {
                    String imageUrl = fileUploadService.uploadImage(imagem);
                    imageUrls.add(imageUrl);
                }
            }
            return ResponseEntity.ok(imageUrls);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}