package com.escola.marketing_api.repository;


import com.escola.marketing_api.model.Curso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    // Buscar cursos por categoria
    List<Curso> findByCategoria(Curso.CategoriaEnsino categoria);

    // Buscar cursos por faixa de preço
    /*List<Curso> findByPrecoBetween(BigDecimal precoMin, BigDecimal precoMax);

    // Buscar cursos em destaque (mais recentes)
    List<Curso> findTop6ByOrderByCreatedDateDesc();

    // Buscar cursos por preço menor ou igual
    List<Curso> findByPrecoLessThanEqual(BigDecimal preco);

    // Buscar cursos por preço maior ou igual
    List<Curso> findByPrecoGreaterThanEqual(BigDecimal preco);

    // Buscar cursos por nome contendo texto (case insensitive)
    @Query("SELECT c FROM Curso c WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Curso> findByNomeContainingIgnoreCase(@Param("nome") String nome);

    // Buscar cursos por categoria e preço
  /*  List<Curso> findByCategoriaAndPrecoBetween(
            Curso.CategoriaEnsino categoria,
            BigDecimal precoMin,
            BigDecimal precoMax
    );*/
}

