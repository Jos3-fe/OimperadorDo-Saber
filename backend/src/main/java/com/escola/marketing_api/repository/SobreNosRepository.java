package com.escola.marketing_api.repository;



import com.escola.marketing_api.model.SobreNos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SobreNosRepository extends JpaRepository<SobreNos, Long> {

    @Query("SELECT s FROM SobreNos s WHERE s.ativo = true ORDER BY s.ultimaModificacao DESC")
    Optional<SobreNos> findAtivoMaisRecente();

    Optional<SobreNos> findByAtivoTrue();

    @Query("SELECT COUNT(s) FROM SobreNos s WHERE s.ativo = true")
    long countAtivos();
}