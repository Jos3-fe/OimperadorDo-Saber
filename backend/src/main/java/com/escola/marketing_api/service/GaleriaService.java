package com.escola.marketing_api.service;



import com.escola.marketing_api.dto.GaleriaDTO;
import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Galeria;
import com.escola.marketing_api.repository.GaleriaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class GaleriaService {

    @Autowired
    private GaleriaRepository galeriaRepository;



    @Transactional(readOnly = true)
    public Page<GaleriaDTO> findAllPaginated(Pageable pageable) {
        try {
            log.info("Buscando galerias paginadas com: {}", pageable);

            Page<Galeria> galerias = galeriaRepository.findAll(pageable);

            log.info("Encontradas {} galerias", galerias.getTotalElements());

            return galerias.map(this::convertToDTO);
        } catch (Exception e) {
            log.error("Erro ao buscar galerias paginadas", e);
            throw new RuntimeException("Erro ao carregar galerias: " + e.getMessage(), e);
        }
    }

    // Buscar por ID
    public GaleriaDTO findById(Long id) {
        Galeria galeria = galeriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Galeria não encontrada com ID: " + id));
        return convertToDTO(galeria);
    }

    // Buscar por slug
    public GaleriaDTO findBySlug(String slug) {
        Galeria galeria = galeriaRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Galeria não encontrada com slug: " + slug));
        return convertToDTO(galeria);
    }

    // Buscar por ano letivo
    public List<GaleriaDTO> findByAnoLetivo(String anoLetivo) {
        return galeriaRepository.findByAnoLetivoOrderByDataPublicacaoDesc(anoLetivo)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ano letivo paginado
    public Page<GaleriaDTO> findByAnoLetivoPaginated(String anoLetivo, Pageable pageable) {
        return galeriaRepository.findByAnoLetivoOrderByDataPublicacaoDesc(anoLetivo, pageable)
                .map(this::convertToDTO);
    }

    // Buscar por tag
    public List<GaleriaDTO> findByTag(String tag) {
        return galeriaRepository.findByTagsContaining(tag)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Buscar por título
    public Page<GaleriaDTO> findByTitulo(String titulo, Pageable pageable) {
        return galeriaRepository.findByTituloContainingIgnoreCaseOrderByDataPublicacaoDesc(titulo, pageable)
                .map(this::convertToDTO);
    }

    // Obter anos letivos disponíveis
    public List<String> getAnosLetivos() {
        return galeriaRepository.findDistinctAnosLetivos();
    }

    // Obter tags disponíveis
    public List<String> getTags() {
        return galeriaRepository.findDistinctTags();
    }

    // Salvar nova galeria
    public GaleriaDTO save(GaleriaDTO galeriaDTO) {
        Galeria galeria = convertToEntity(galeriaDTO);

        // Gerar slug se não fornecido
        if (galeria.getSlug() == null || galeria.getSlug().isEmpty()) {
            galeria.setSlug(generateSlug(galeria.getTitulo()));
        }

        // Garantir slug único
        galeria.setSlug(ensureUniqueSlug(galeria.getSlug()));

        // Definir data de publicação se não fornecida
        if (galeria.getDataPublicacao() == null) {
            galeria.setDataPublicacao(LocalDate.now());
        }

        Galeria savedGaleria = galeriaRepository.save(galeria);
        return convertToDTO(savedGaleria);
    }

    // Atualizar galeria
    public GaleriaDTO update(Long id, GaleriaDTO galeriaDTO) {
        Galeria existingGaleria = galeriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Galeria não encontrada com ID: " + id));

        updateEntityFromDTO(existingGaleria, galeriaDTO);

        // Atualizar slug se título foi alterado
        if (!existingGaleria.getTitulo().equals(galeriaDTO.getTitulo())) {
            String newSlug = generateSlug(galeriaDTO.getTitulo());
            if (!newSlug.equals(existingGaleria.getSlug())) {
                existingGaleria.setSlug(ensureUniqueSlug(newSlug, id));
            }
        }

        Galeria updatedGaleria = galeriaRepository.save(existingGaleria);
        return convertToDTO(updatedGaleria);
    }

    // Deletar galeria
    public void deleteById(Long id) {
        if (!galeriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Galeria não encontrada com ID: " + id);
        }
        galeriaRepository.deleteById(id);
    }



    private GaleriaDTO convertToDTO(Galeria galeria) {
        try {
            if (galeria == null) {
                return null;
            }

            GaleriaDTO dto = new GaleriaDTO();
            dto.setId(galeria.getId());
            dto.setTitulo(galeria.getTitulo());
            dto.setSlug(galeria.getSlug());
            dto.setConteudo(galeria.getConteudo());
            dto.setAnoLetivo(galeria.getAnoLetivo());
            dto.setDataPublicacao(galeria.getDataPublicacao());
            dto.setDataCriacao(galeria.getDataCriacao());
            dto.setUltimaModificacao(galeria.getUltimaModificacao());

            // Tratar listas que podem ser null
            dto.setImagens(galeria.getImagens() != null ?
                    new ArrayList<>(galeria.getImagens()) : new ArrayList<>());

            dto.setTags(galeria.getTags() != null ?
                    new ArrayList<>(galeria.getTags()) : new ArrayList<>());

            return dto;
        } catch (Exception e) {
            log.error("Erro ao converter Galeria para DTO: galeria={}", galeria.getId(), e);
            throw new RuntimeException("Erro na conversão para DTO", e);
        }
    }

    private Galeria convertToEntity(GaleriaDTO dto) {
        Galeria galeria = new Galeria();
        updateEntityFromDTO(galeria, dto);
        return galeria;
    }

    private void updateEntityFromDTO(Galeria galeria, GaleriaDTO dto) {
        galeria.setTitulo(dto.getTitulo());
        galeria.setSlug(dto.getSlug());
        galeria.setConteudo(dto.getConteudo());
        galeria.setAnoLetivo(dto.getAnoLetivo());
        galeria.setDataPublicacao(dto.getDataPublicacao());
        galeria.setImagens(dto.getImagens());
        galeria.setTags(dto.getTags());
    }

    private String generateSlug(String titulo) {
        return titulo.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private String ensureUniqueSlug(String baseSlug) {
        return ensureUniqueSlug(baseSlug, null);
    }

    private String ensureUniqueSlug(String baseSlug, Long excludeId) {
        String slug = baseSlug;
        int counter = 1;

        while (true) {
            // Para criação (excludeId = null): verifica se slug existe
            if (excludeId == null) {
                if (!galeriaRepository.existsBySlug(slug)) {
                    return slug; // Slug disponível
                }
            }
            // Para atualização (excludeId != null): verifica se slug pertence a outro registro
            else {
                Galeria existing = galeriaRepository.findBySlug(slug).orElse(null);
                if (existing == null || existing.getId().equals(excludeId)) {
                    return slug; // Slug disponível ou pertence ao próprio registro
                }
            }

            // Gerar próximo slug
            slug = baseSlug + "-" + counter++;
        }
    }
}