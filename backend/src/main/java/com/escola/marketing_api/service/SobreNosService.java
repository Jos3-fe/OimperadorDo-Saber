package com.escola.marketing_api.service;



import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.SobreNos;
import com.escola.marketing_api.repository.SobreNosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SobreNosService {

    @Autowired
    private SobreNosRepository sobreNosRepository;

    public List<SobreNos> findAll() {
        return sobreNosRepository.findAll();
    }

    public SobreNos findAtivo() {
        return sobreNosRepository.findByAtivoTrue()
                .orElseThrow(() -> new ResourceNotFoundException("Informações 'Sobre Nós' não encontradas"));
    }

    public SobreNos findById(Long id) {
        return sobreNosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Informações não encontradas com ID: " + id));
    }

    public SobreNos save(SobreNos sobreNos) {
        sobreNos.setDataCriacao(LocalDateTime.now());
        sobreNos.setUltimaModificacao(LocalDateTime.now());
        return sobreNosRepository.save(sobreNos);
    }

    public SobreNos update(Long id, SobreNos sobreNosDetails) {
        SobreNos sobreNos = findById(id);

        sobreNos.setTitulo(sobreNosDetails.getTitulo());
        sobreNos.setConteudo(sobreNosDetails.getConteudo());
        sobreNos.setSubtitulo(sobreNosDetails.getSubtitulo());
        sobreNos.setImgPrincipal(sobreNosDetails.getImgPrincipal());
        sobreNos.setMissao(sobreNosDetails.getMissao());
        sobreNos.setVisao(sobreNosDetails.getVisao());
        sobreNos.setValores(sobreNosDetails.getValores());
        sobreNos.setHistoria(sobreNosDetails.getHistoria());
        sobreNos.setEquipe(sobreNosDetails.getEquipe());
        sobreNos.setContatoPrincipal(sobreNosDetails.getContatoPrincipal());
        sobreNos.setEmailInstitucional(sobreNosDetails.getEmailInstitucional());
        sobreNos.setTelefonePrincipal(sobreNosDetails.getTelefonePrincipal());
        sobreNos.setEndereco(sobreNosDetails.getEndereco());
        sobreNos.setRedesSociais(sobreNosDetails.getRedesSociais());
        sobreNos.setCertificacoes(sobreNosDetails.getCertificacoes());
        sobreNos.setAtivo(sobreNosDetails.getAtivo());
        sobreNos.setUltimaModificacao(LocalDateTime.now());

        return sobreNosRepository.save(sobreNos);
    }

    public void deleteById(Long id) {
        if (!sobreNosRepository.existsById(id)) {
            throw new ResourceNotFoundException("Informações não encontradas com ID: " + id);
        }
        sobreNosRepository.deleteById(id);
    }
}
