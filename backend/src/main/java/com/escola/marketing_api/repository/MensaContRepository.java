package com.escola.marketing_api.repository;

import com.escola.marketing_api.model.MensaCont;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensaContRepository extends JpaRepository<MensaCont, Long> {



    @Query("SELECT m FROM MensaCont m WHERE m.dataCriacao >= :dataInicial AND m.dataCriacao <= :dataFinal")
    List<MensaCont> findMensagensPorPeriodo(@Param("dataInicial") LocalDateTime dataInicial,
                                            @Param("dataFinal") LocalDateTime dataFinal);

}