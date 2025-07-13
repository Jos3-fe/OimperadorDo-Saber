package com.escola.marketing_api.service;

import com.escola.marketing_api.dto.NoticiaDTO;
import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Noticia;
import com.escola.marketing_api.repository.NoticiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;


@Service
@Transactional
public class NoticiaService {

    @Autowired
    private NoticiaRepository noticiaRepository;

    @Autowired
    private AdminService administradorService; // Para vincular o admin

    // Listar todas (paginadas)
    public Page<NoticiaDTO> findAllPaginated(Pageable pageable) {
        return noticiaRepository.findByOrderByDataPublicacaoDesc(pageable)
                .map(this::convertToDTO);
    }

    // Buscar por ID
    public NoticiaDTO findById(Long id) {
        Noticia noticia = noticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notícia não encontrada com ID: " + id));
        return convertToDTO(noticia);
    }


    // Método save() atualizado no NoticiaService
    public NoticiaDTO save(NoticiaDTO noticiaDTO, Long adminId) {
        Noticia noticia = convertToEntity(noticiaDTO);
        noticia.setAdministrador(administradorService.findById(adminId));
        noticia.setDataPublicacao(LocalDateTime.now());

        Noticia savedNoticia = noticiaRepository.save(noticia);
        return convertToDTO(savedNoticia);
    }



    // Atualizar notícia
    public NoticiaDTO update(Long id, NoticiaDTO noticiaDTO) {
        Noticia existingNoticia = noticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notícia não encontrada com ID: " + id));

        updateEntityFromDTO(existingNoticia, noticiaDTO);

        Noticia updatedNoticia = noticiaRepository.save(existingNoticia);
        return convertToDTO(updatedNoticia);
    }



    // Deletar notícia
    public void deleteById(Long id) {
        if (!noticiaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notícia não encontrada com ID: " + id);
        }
        noticiaRepository.deleteById(id);
    }

    // Métodos auxiliares (DTO <-> Entity)
    private NoticiaDTO convertToDTO(Noticia noticia) {
        NoticiaDTO dto = new NoticiaDTO();
        dto.setId(noticia.getId());
        dto.setTitulo(noticia.getTitulo());
        dto.setConteudo(noticia.getConteudo());
        dto.setImgUrl(noticia.getImgUrl());
        dto.setDataPublicacao(noticia.getDataPublicacao());
        dto.setAdminId(noticia.getAdministrador().getId());
        return dto;
    }

    private Noticia convertToEntity(NoticiaDTO dto) {
        Noticia noticia = new Noticia();
        updateEntityFromDTO(noticia, dto);
        return noticia;
    }

    private void updateEntityFromDTO(Noticia noticia, NoticiaDTO dto) {
        noticia.setTitulo(dto.getTitulo());
        noticia.setConteudo(dto.getConteudo());
        noticia.setImgUrl(dto.getImgUrl());

    }
}