package com.escola.marketing_api.service;

import com.escola.marketing_api.dto.DocumentoDTO;
import com.escola.marketing_api.exception.ResourceNotFoundException;
import com.escola.marketing_api.model.Documentos;
import com.escola.marketing_api.repository.DocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@Transactional
public class DocumentoService {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private AdminService administradorService;

    private final Path rootLocation = Paths.get("uploads/documentos");

    // Salvar documento (com upload de arquivo)
    public DocumentoDTO save(MultipartFile file, Long adminId, String descricao) throws IOException {
        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path destinationFile = this.rootLocation.resolve(fileName);
        Files.copy(file.getInputStream(), destinationFile);

        Documentos documento = new Documentos();
        documento.setNome(file.getOriginalFilename());
        documento.setFilePath(destinationFile.toString());
        documento.setAdministrador(administradorService.findById(adminId));
        documento.setDataUpload(LocalDateTime.now());
        documento.setDescricao(descricao);

        // NOVO: Salvar o tamanho do arquivo
        documento.setTamanho(file.getSize());

        Documentos savedDoc = documentoRepository.save(documento);
        return convertToDTO(savedDoc);
    }

    public DocumentoDTO findById(Long id) {
        Documentos documento = documentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Documento não encontrado com ID: " + id));
        return convertToDTO(documento);
    }

    public void deleteById(Long id) throws IOException {
        Documentos documento = documentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Documento não encontrado com ID: " + id));

        Path filePathToDelete = Paths.get(documento.getFilePath());
        if (Files.exists(filePathToDelete)) {
            Files.delete(filePathToDelete);
        }
        documentoRepository.delete(documento);
    }

    public Page<DocumentoDTO> findAllPaginated(Pageable pageable) {
        return documentoRepository.findAll(pageable).map(this::convertToDTO);
    }

    // Método convertToDTO SIMPLIFICADO - agora os dados vêm da entidade
    private DocumentoDTO convertToDTO(Documentos documento) {
        DocumentoDTO dto = new DocumentoDTO();
        dto.setId(documento.getId());
        dto.setNome(documento.getNome());
        dto.setFilePath(documento.getFilePath());
        dto.setDataUpload(documento.getDataUpload());
        dto.setAdminId(documento.getAdministrador().getId());
        dto.setDescricao(documento.getDescricao()); // Vem da entidade
        dto.setTamanho(documento.getTamanho());     // Vem da entidade

        return dto;
    }
}