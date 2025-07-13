package com.escola.marketing_api.repository;

import com.escola.marketing_api.model.Documentos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documentos, Long> {
    Page<Documentos> findByNomeContainingIgnoreCaseOrDescricaoContainingIgnoreCase(
            String nome, String descricao, Pageable pageable);
}