package com.escola.marketing_api.service;

import com.escola.marketing_api.dto.MensaContDTO;
import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Administrador;
import com.escola.marketing_api.model.MensaCont;
import com.escola.marketing_api.repository.AdministradorRepository;
import com.escola.marketing_api.repository.MensaContRepository;
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
public class MensagemService {

    @Autowired
    private MensaContRepository mensagemRepository;

    @Autowired
    private AdministradorRepository administradorRepository;


    public List<MensaContDTO> findAll() {
        return mensagemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<MensaContDTO> findAllPaginated(Pageable pageable) {
        return mensagemRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    // Este método agora está correto, pois chama findMensagensPendentes() do repositório
   /* public List<MensaContDTO> findPendentes() {
        List<MensaCont> mensagens = mensagemRepository.findMensagensPendentes();
        return mensagens.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }*/



    public MensaContDTO findById(Long id) {
        MensaCont mensagem = mensagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem não encontrada com ID: " + id));
        return convertToDTO(mensagem);
    }

    public MensaContDTO save(MensaContDTO mensagemDTO) {
        MensaCont mensagem = convertToEntity(mensagemDTO);
        mensagem.setDataCriacao(LocalDateTime.now());
        // Se o status não for definido no DTO, defina como PENDENTE por padrão

        MensaCont savedMensagem = mensagemRepository.save(mensagem);
        return convertToDTO(savedMensagem);
    }

    public MensaContDTO responder(Long id, String resposta, Long adminId) {
        MensaCont mensagem = mensagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem não encontrada com ID: " + id));

        Administrador admin = administradorRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado com ID: " + adminId));


        mensagem.setDataResposta(LocalDateTime.now());

        MensaCont updatedMensagem = mensagemRepository.save(mensagem);
        return convertToDTO(updatedMensagem);
    }



    public void deleteById(Long id) {
        if (!mensagemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mensagem não encontrada com ID: " + id);
        }
        mensagemRepository.deleteById(id);
    }

    private MensaContDTO convertToDTO(MensaCont mensagem) {
        MensaContDTO dto = new MensaContDTO();
        dto.setId(mensagem.getId());
        dto.setNome(mensagem.getNome());
        dto.setEmail(mensagem.getEmail());
        dto.setTelefone(mensagem.getTelefone());
        dto.setAssunto(mensagem.getAssunto());
        dto.setMensagem(mensagem.getMensagem());
        dto.setDataCriacao(mensagem.getDataCriacao());
        dto.setDataResposta(mensagem.getDataResposta());

        return dto;
    }

    private MensaCont convertToEntity(MensaContDTO dto) {
        MensaCont mensagem = new MensaCont();
        // Não defina o ID aqui, pois ele é gerado automaticamente
        mensagem.setNome(dto.getNome());
        mensagem.setEmail(dto.getEmail());
        mensagem.setTelefone(dto.getTelefone());
        mensagem.setAssunto(dto.getAssunto());
        mensagem.setMensagem(dto.getMensagem());
        // Se o status for nulo no DTO, defina um padrão ou trate o erro

        return mensagem;
    }
}