package com.escola.marketing_api.service;

import com.escola.marketing_api.dto.DirecaoDTO;
import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Direcao;
import com.escola.marketing_api.repository.DirecaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DirecaoService {

    @Autowired
    private DirecaoRepository direcaoRepository;

    // Listar todos (ordenados por cargo)
    public List<DirecaoDTO> findAll() {
        return direcaoRepository.findAllOrderByCargo().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Buscar por ID
    public DirecaoDTO findById(Long id) {
        Direcao direcao = direcaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membro da direção não encontrado com ID: " + id));
        return convertToDTO(direcao);
    }

    // Salvar novo membro
    public DirecaoDTO save(DirecaoDTO direcaoDTO) {
        Direcao direcao = convertToEntity(direcaoDTO);
        Direcao savedDirecao = direcaoRepository.save(direcao);
        return convertToDTO(savedDirecao);
    }

    // Atualizar membro
    public DirecaoDTO update(Long id, DirecaoDTO direcaoDTO) {
        Direcao existingDirecao = direcaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membro da direção não encontrado com ID: " + id));

        updateEntityFromDTO(existingDirecao, direcaoDTO);

        Direcao updatedDirecao = direcaoRepository.save(existingDirecao);
        return convertToDTO(updatedDirecao);
    }

    // Deletar membro
    public void deleteById(Long id) {
        if (!direcaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membro da direção não encontrado com ID: " + id);
        }
        direcaoRepository.deleteById(id);
    }

    // Métodos auxiliares (DTO <-> Entity)
    private DirecaoDTO convertToDTO(Direcao direcao) {
        DirecaoDTO dto = new DirecaoDTO();
        dto.setId(direcao.getId());
        dto.setNome(direcao.getNome());
        dto.setCargo(direcao.getCargo());
        dto.setDetalhes(direcao.getDetalhes());
        dto.setImgUrl(direcao.getImgUrl());
        return dto;
    }

    private Direcao convertToEntity(DirecaoDTO dto) {
        Direcao direcao = new Direcao();
        updateEntityFromDTO(direcao, dto);
        return direcao;
    }

    private void updateEntityFromDTO(Direcao direcao, DirecaoDTO dto) {
        direcao.setNome(dto.getNome());
        direcao.setCargo(dto.getCargo());
        direcao.setDetalhes(dto.getDetalhes());
        direcao.setImgUrl(dto.getImgUrl());
    }
}