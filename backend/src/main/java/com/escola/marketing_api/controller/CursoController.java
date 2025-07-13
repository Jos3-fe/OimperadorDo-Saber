package com.escola.marketing_api.controller;

import com.escola.marketing_api.dto.CursoDTO;
import com.escola.marketing_api.model.Curso;
import com.escola.marketing_api.service.CursoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    // ENDPOINT PÚBLICO - Lista todos os cursos sem paginação
    @GetMapping
    public ResponseEntity<List<CursoDTO>> getAllCursos() {
        List<CursoDTO> cursos = cursoService.findAll();
        return ResponseEntity.ok(cursos);
    }

    // ENDPOINT PÚBLICO - Paginação para administração
    @GetMapping("/paginated")
    public ResponseEntity<Page<CursoDTO>> getCursosPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CursoDTO> cursos = cursoService.findAllPaginated(pageable);
        return ResponseEntity.ok(cursos);
    }

    // ENDPOINT PÚBLICO - Buscar curso por ID
    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> getCursoById(@PathVariable Long id) {
        CursoDTO curso = cursoService.findById(id);
        return ResponseEntity.ok(curso);
    }

    // NOVOS ENDPOINTS PARA ATENDER O FRONTEND

    // Buscar categorias disponíveis
    @GetMapping("/categorias")
    public ResponseEntity<List<String>> getCategorias() {
        List<String> categorias = cursoService.getCategorias();
        return ResponseEntity.ok(categorias);
    }

    // Buscar cursos em destaque
   /* @GetMapping("/destaque")
    public ResponseEntity<List<CursoDTO>> getCursosDestaque() {
        List<CursoDTO> cursosDestaque = cursoService.findCursosDestaque();
        return ResponseEntity.ok(cursosDestaque);
    }*/

    // Buscar cursos por faixa de preço
   /* @GetMapping("/por-preco")
    public ResponseEntity<List<CursoDTO>> getCursosPorPreco(
            @RequestParam(required = false) BigDecimal precoMin,
            @RequestParam(required = false) BigDecimal precoMax) {

        BigDecimal min = precoMin != null ? precoMin : BigDecimal.ZERO;
        BigDecimal max = precoMax != null ? precoMax : new BigDecimal("999999.99");

        List<CursoDTO> cursos = cursoService.findCursosByPrecoRange(min, max);
        return ResponseEntity.ok(cursos);
    }*/

    // Buscar cursos agrupados por categoria
    @GetMapping("/por-categoria")
    public ResponseEntity<Map<String, List<CursoDTO>>> getCursosPorCategoria() {
        Map<String, List<CursoDTO>> cursosPorCategoria = cursoService.findCursosPorCategoria();
        return ResponseEntity.ok(cursosPorCategoria);
    }

    // Buscar cursos por categoria específica
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<CursoDTO>> getCursosByCategoria(@PathVariable String categoria) {
        try {
            Curso.CategoriaEnsino categoriaEnum = Curso.CategoriaEnsino.fromCodigo(categoria);
            List<CursoDTO> cursos = cursoService.findByCategoria(categoriaEnum);
            return ResponseEntity.ok(cursos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    

    // ENDPOINTS ADMINISTRATIVOS

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CursoDTO>> getAllCursosAdmin() {
        List<CursoDTO> cursos = cursoService.findAll();
        return ResponseEntity.ok(cursos);
    }

    // Endpoint admin para buscar curso específico (se necessário dados extras)
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CursoDTO> getCursoByIdAdmin(@PathVariable Long id) {
        CursoDTO curso = cursoService.findById(id);
        return ResponseEntity.ok(curso);
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCurso(@Valid @RequestBody CursoDTO cursoDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> fieldError.getDefaultMessage() != null ?
                                    fieldError.getDefaultMessage() : "Erro de validação"
                    ));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            CursoDTO savedCurso = cursoService.save(cursoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCurso);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erro interno ao processar requisição"));
        }
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CursoDTO> updateCurso(@PathVariable Long id,
                                                @Valid @RequestBody CursoDTO cursoDTO) {
        CursoDTO cursoAtualizado = cursoService.update(id, cursoDTO);
        return ResponseEntity.ok(cursoAtualizado);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCurso(@PathVariable Long id) {
        cursoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}