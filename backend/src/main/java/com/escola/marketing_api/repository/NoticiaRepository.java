package com.escola.marketing_api.repository;

import com.escola.marketing_api.model.Noticia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {

    // Notícias ativas paginadas (ordenadas por data decrescente)
    Page<Noticia> findByOrderByDataPublicacaoDesc(Pageable pageable);



}
