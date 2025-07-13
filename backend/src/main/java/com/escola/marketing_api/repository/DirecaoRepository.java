package com.escola.marketing_api.repository;

import com.escola.marketing_api.model.Direcao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DirecaoRepository extends JpaRepository<Direcao, Long> {

    // Ordenar por cargo (ex: "Diretor", "Coordenador")
    @Query("SELECT d FROM Direcao d ORDER BY " +
            "CASE WHEN d.cargo = 'Diretor' THEN 1 " +
            "WHEN d.cargo = 'Vice-Diretor' THEN 2 " +
            "ELSE 3 END")
    List<Direcao> findAllOrderByCargo();

    // Busca por cargo
    List<Direcao> findByCargoContainingIgnoreCase(String cargo);

    // Membros com imagem de perfil
    @Query("SELECT d FROM Direcao d WHERE d.imgUrl IS NOT NULL")
    List<Direcao> findComImagem();
}