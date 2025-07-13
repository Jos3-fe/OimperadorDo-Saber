package com.escola.marketing_api.repository;

import com.escola.marketing_api.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {

    Optional<Administrador> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Administrador> findByAtivoTrue();


    @Query("SELECT a FROM Administrador a WHERE a.email = :email AND a.ativo = true")
    Optional<Administrador> findByEmailAndAtivoTrue(@Param("email") String email);

    @Query("SELECT COUNT(a) FROM Administrador a WHERE a.ativo = true")
    long countAtivos();
}
