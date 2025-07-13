package com.escola.marketing_api.repository;

import com.escola.marketing_api.model.Galeria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GaleriaRepository extends JpaRepository<Galeria, Long> {

    // Buscar por slug (URLs amigáveis)
    Optional<Galeria> findBySlug(String slug);

    // Verificar se slug já existe
    boolean existsBySlug(String slug);

    // Buscar por ano letivo
    List<Galeria> findByAnoLetivoOrderByDataPublicacaoDesc(String anoLetivo);

    // Buscar por ano letivo paginado
    Page<Galeria> findByAnoLetivoOrderByDataPublicacaoDesc(String anoLetivo, Pageable pageable);

    // Listar ordenado por data de publicação (mais recente primeiro)
    Page<Galeria> findByOrderByDataPublicacaoDesc(Pageable pageable);

    // Buscar por tag
    @Query("SELECT g FROM Galeria g WHERE :tag MEMBER OF g.tags ORDER BY g.dataPublicacao DESC")
    List<Galeria> findByTagsContaining(@Param("tag") String tag);

    // Buscar por múltiplas tags
    @Query("SELECT DISTINCT g FROM Galeria g JOIN g.tags t WHERE t IN :tags ORDER BY g.dataPublicacao DESC")
    List<Galeria> findByTagsIn(@Param("tags") List<String> tags);

    // Buscar por título (case insensitive)
    Page<Galeria> findByTituloContainingIgnoreCaseOrderByDataPublicacaoDesc(String titulo, Pageable pageable);

    // Buscar todos os anos letivos distintos
    @Query("SELECT DISTINCT g.anoLetivo FROM Galeria g WHERE g.anoLetivo IS NOT NULL ORDER BY g.anoLetivo DESC")
    List<String> findDistinctAnosLetivos();

    // Buscar todas as tags distintas
    @Query("SELECT DISTINCT t FROM Galeria g JOIN g.tags t ORDER BY t")
    List<String> findDistinctTags();



    // No GaleriaRepository, adicione este método:
    boolean existsBySlugAndIdNot(String slug, Long id);
}