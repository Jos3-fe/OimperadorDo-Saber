package com.escola.marketing_api.service;

import com.escola.marketing_api.dto.CursoDTO;
import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Curso;
import com.escola.marketing_api.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;


    public List<CursoDTO> findAll() {
        return cursoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<CursoDTO> findAllPaginated(Pageable pageable) {
        return cursoRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public CursoDTO findById(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado com ID: " + id));
        return convertToDTO(curso);
    }

    public CursoDTO save(CursoDTO cursoDTO) {
        // Validação explícita dos campos obrigatórios
        if (cursoDTO.getNome() == null || cursoDTO.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do curso é obrigatório");
        }

        if (cursoDTO.getCategoria() == null) {
            throw new IllegalArgumentException("Categoria do curso é obrigatória");
        }

        // Conversão para entidade
        Curso curso = convertToEntity(cursoDTO);

        try {
            Curso savedCurso = cursoRepository.save(curso);
            return convertToDTO(savedCurso);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Erro de integridade de dados: " + e.getRootCause().getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar curso: " + e.getMessage(), e);
        }
    }

    private Curso convertToEntity(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setNome(dto.getNome());
        curso.setDescricaoDetalhada(dto.getDescricaoDetalhada());
        curso.setPreco(dto.getPreco());

        // Conversão segura da categoria
        if (dto.getCategoria() != null) {
            try {
                curso.setCategoria(Curso.CategoriaEnsino.valueOf(dto.getCategoria().name()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Categoria inválida: " + dto.getCategoria());
            }
        }

        return curso;
    }

    public CursoDTO update(Long id, CursoDTO cursoDTO) {
        Curso existingCurso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado com ID: " + id));

        updateEntityFromDTO(existingCurso, cursoDTO);

        Curso updatedCurso = cursoRepository.save(existingCurso);
        return convertToDTO(updatedCurso);
    }

    public void deleteById(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Curso não encontrado com ID: " + id);
        }
        cursoRepository.deleteById(id);
    }

    // NOVOS MÉTODOS PARA ATENDER O FRONTEND

    public List<String> getCategorias() {
        return Arrays.stream(Curso.CategoriaEnsino.values())
                .map(Curso.CategoriaEnsino::getDescricao)
                .collect(Collectors.toList());
    }

    /*public List<CursoDTO> findCursosDestaque() {
        // Implementação simples: retorna os 6 cursos mais recentes
        return cursoRepository.findTop6ByOrderByCreatedDateDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CursoDTO> findCursosByPrecoRange(BigDecimal precoMin, BigDecimal precoMax) {
        return cursoRepository.findByPrecoBetween(precoMin, precoMax).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }*/

    public Map<String, List<CursoDTO>> findCursosPorCategoria() {
        List<Curso> cursos = cursoRepository.findAll();
        return cursos.stream()
                .filter(curso -> curso.getCategoria() != null)
                .collect(Collectors.groupingBy(
                        curso -> curso.getCategoria().getDescricao(),
                        Collectors.mapping(this::convertToDTO, Collectors.toList())
                ));
    }

    public List<CursoDTO> findByCategoria(Curso.CategoriaEnsino categoria) {
        return cursoRepository.findByCategoria(categoria).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // MÉTODOS DE CONVERSÃO CORRIGIDOS
    private CursoDTO convertToDTO(Curso curso) {
        CursoDTO dto = new CursoDTO();
        dto.setId(curso.getId());
        dto.setNome(curso.getNome());
        dto.setDescricaoDetalhada(curso.getDescricaoDetalhada());
        dto.setPreco(curso.getPreco());
        dto.setCategoria(curso.getCategoria()); // CAMPO ADICIONADO
        return dto;
    }

    private void updateEntityFromDTO(Curso curso, CursoDTO dto) {
        curso.setNome(dto.getNome());
        curso.setDescricaoDetalhada(dto.getDescricaoDetalhada());
        curso.setPreco(dto.getPreco());
        curso.setCategoria(dto.getCategoria()); // CAMPO ADICIONADO
    }
}