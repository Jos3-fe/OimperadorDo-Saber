package com.escola.marketing_api.controller;

import com.escola.marketing_api.dto.DocumentoDTO;
import com.escola.marketing_api.service.DocumentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    // Público - Listar documentos paginados
    @GetMapping("/paginated")
    public ResponseEntity<Page<DocumentoDTO>> getDocumentosPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataUpload") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<DocumentoDTO> documentos = documentoService.findAllPaginated(pageable);
        return ResponseEntity.ok(documentos);
    }

    // NOVO MÉTODO - Download de documento
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocumento(@PathVariable Long id) {
        try {
            // Buscar o documento pelo ID
            DocumentoDTO documento = documentoService.findById(id);

            // Criar o caminho para o arquivo
            Path filePath = Paths.get(documento.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            // Verificar se o arquivo existe e é legível
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Determinar o tipo de conteúdo
            String contentType = null;
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException ex) {
                // Fallback para tipo genérico
                contentType = "application/octet-stream";
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Retornar o arquivo como attachment para download
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + documento.getNome() + "\"")
                    .body(resource);

        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Administrativo - Upload de documento
    @PostMapping("/admin/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DocumentoDTO> uploadDocumento(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("admin-id") Long adminId,
            @RequestParam(value = "descricao", required = false) String descricao) throws IOException {
        DocumentoDTO documento = documentoService.save(file, adminId, descricao);
        return ResponseEntity.status(HttpStatus.CREATED).body(documento);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDocumento(@PathVariable Long id) throws IOException {
        documentoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}