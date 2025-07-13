package com.escola.marketing_api.service;


import com.escola.marketing_api.dto.EventoDTO;
import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Evento;
import com.escola.marketing_api.repository.EventoRepository;
import com.escola.marketing_api.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<EventoDTO> findAll() {
        return eventoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<EventoDTO> findAllPaginated(Pageable pageable) {
        return eventoRepository.findAll(pageable)
                .map(this::convertToDTO);
    }


    public EventoDTO findById(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com ID: " + id));
        return convertToDTO(evento);
    }

    public EventoDTO save(EventoDTO eventoDTO) {
        Evento evento = convertToEntity(eventoDTO);
        evento.setUltimaModificacao(LocalDateTime.now());
        Evento savedEvento = eventoRepository.save(evento);
        return convertToDTO(savedEvento);
    }

    public EventoDTO update(Long id, EventoDTO eventoDTO) {
        Evento existingEvento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com ID: " + id));

        updateEntityFromDTO(existingEvento, eventoDTO);
        existingEvento.setUltimaModificacao(LocalDateTime.now());

        Evento updatedEvento = eventoRepository.save(existingEvento);
        return convertToDTO(updatedEvento);
    }

    public void deleteById(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento não encontrado com ID: " + id);
        }
        eventoRepository.deleteById(id);
    }


    // Ajustes no EventoService para compatibilidade

    // Método convertToDTO atualizado para incluir adminId se necessário
    private EventoDTO convertToDTO(Evento evento) {
        EventoDTO dto = new EventoDTO();
        dto.setId(evento.getId());
        dto.setTitulo(evento.getTitulo());
        dto.setDescricao(evento.getDescricao());
        dto.setImgUrl(evento.getImgUrl());
        dto.setDataEvento(evento.getDataEvento());
        dto.setDataFim(evento.getDataFim());
        dto.setLocal(evento.getLocal());
        dto.setUltimaModificacao(evento.getUltimaModificacao());

        // Incluir adminId se administrador estiver presente
        if (evento.getAdministrador() != null) {
            dto.setAdminId(evento.getAdministrador().getId());
        }

        return dto;
    }

    // Se você quiser vincular eventos a administradores, adicione este método:
    public EventoDTO saveWithAdmin(EventoDTO eventoDTO, Long adminId) {
        Evento evento = convertToEntity(eventoDTO);

        // Se você tem AdminService, descomente a linha abaixo:
        // evento.setAdministrador(adminService.findById(adminId));

        evento.setUltimaModificacao(LocalDateTime.now());

        Evento savedEvento = eventoRepository.save(evento);
        return convertToDTO(savedEvento);
    }


    private Evento convertToEntity(EventoDTO dto) {
        Evento evento = new Evento();
        updateEntityFromDTO(evento, dto);
        return evento;
    }

    private void updateEntityFromDTO(Evento evento, EventoDTO dto) {
        evento.setTitulo(dto.getTitulo());
        evento.setDescricao(dto.getDescricao());
        evento.setImgUrl(dto.getImgUrl());
        evento.setDataEvento(dto.getDataEvento());
        evento.setDataFim(dto.getDataFim());
        evento.setLocal(dto.getLocal());
    }
}
