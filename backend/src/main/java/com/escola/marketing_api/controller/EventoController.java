package com.escola.marketing_api.controller;

import com.escola.marketing_api.dto.EventoDTO;
import com.escola.marketing_api.service.EventoService;
import com.escola.marketing_api.service.FileUploadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private FileUploadService fileUploadService;

    // Público - Listar paginado
    @GetMapping("/paginated")
    public ResponseEntity<Page<EventoDTO>> getEventosPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataEvento") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EventoDTO> eventos = eventoService.findAllPaginated(pageable);
        return ResponseEntity.ok(eventos);
    }

    // Público - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> getEventoById(@PathVariable Long id) {
        EventoDTO evento = eventoService.findById(id);
        return ResponseEntity.ok(evento);
    }

    // Admin - Listar todos
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventoDTO>> getAllEventosAdmin() {
        List<EventoDTO> eventos = eventoService.findAll();
        return ResponseEntity.ok(eventos);
    }

    // Admin - Criar evento COM imagem
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventoDTO> createEvento(
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam(value = "descricaoDetalhada", required = false) String descricaoDetalhada,
            @RequestParam("dataEvento") String dataEventoStr,
            @RequestParam(value = "dataFim", required = false) String dataFimStr,
            @RequestParam(value = "local", required = false) String local,
            @RequestParam(value = "preco", defaultValue = "0") String precoStr,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        try {
            EventoDTO eventoDTO = new EventoDTO();
            eventoDTO.setTitulo(titulo);
            eventoDTO.setDescricao(descricao);
            eventoDTO.setDescricaoDetalhada(descricaoDetalhada);
            eventoDTO.setLocal(local);

            // Converter datas
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            eventoDTO.setDataEvento(LocalDateTime.parse(dataEventoStr, formatter));

            if (dataFimStr != null && !dataFimStr.isEmpty()) {
                eventoDTO.setDataFim(LocalDateTime.parse(dataFimStr, formatter));
            }

            // Converter preço
            eventoDTO.setPreco(new BigDecimal(precoStr));

            // Upload da imagem se fornecida
            if (imagem != null && !imagem.isEmpty()) {
                String imageUrl = fileUploadService.uploadImage(imagem);
                eventoDTO.setImgUrl(imageUrl);
            }

            EventoDTO novoEvento = eventoService.save(eventoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoEvento);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Atualizar evento COM imagem
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventoDTO> updateEvento(
            @PathVariable Long id,
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam(value = "descricaoDetalhada", required = false) String descricaoDetalhada,
            @RequestParam("dataEvento") String dataEventoStr,
            @RequestParam(value = "dataFim", required = false) String dataFimStr,
            @RequestParam(value = "local", required = false) String local,
            @RequestParam(value = "preco", defaultValue = "0") String precoStr,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestParam(value = "manterImagem", defaultValue = "true") boolean manterImagem) {

        try {
            // Buscar evento atual
            EventoDTO eventoAtual = eventoService.findById(id);

            EventoDTO eventoDTO = new EventoDTO();
            eventoDTO.setTitulo(titulo);
            eventoDTO.setDescricao(descricao);
            eventoDTO.setDescricaoDetalhada(descricaoDetalhada);
            eventoDTO.setLocal(local);

            // Converter datas
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            eventoDTO.setDataEvento(LocalDateTime.parse(dataEventoStr, formatter));

            if (dataFimStr != null && !dataFimStr.isEmpty()) {
                eventoDTO.setDataFim(LocalDateTime.parse(dataFimStr, formatter));
            }

            // Converter preço
            eventoDTO.setPreco(new BigDecimal(precoStr));

            // Lógica para imagem
            if (imagem != null && !imagem.isEmpty()) {
                // Nova imagem fornecida - deletar a anterior se existir
                if (eventoAtual.getImgUrl() != null) {
                    fileUploadService.deleteImage(eventoAtual.getImgUrl());
                }
                String imageUrl = fileUploadService.uploadImage(imagem);
                eventoDTO.setImgUrl(imageUrl);
            } else if (manterImagem) {
                // Manter imagem atual
                eventoDTO.setImgUrl(eventoAtual.getImgUrl());
            } else {
                // Remover imagem
                if (eventoAtual.getImgUrl() != null) {
                    fileUploadService.deleteImage(eventoAtual.getImgUrl());
                }
                eventoDTO.setImgUrl(null);
            }

            EventoDTO eventoAtualizado = eventoService.update(id, eventoDTO);
            return ResponseEntity.ok(eventoAtualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin - Deletar evento
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        // Buscar e deletar imagem antes de deletar o registro
        try {
            EventoDTO evento = eventoService.findById(id);
            if (evento.getImgUrl() != null) {
                fileUploadService.deleteImage(evento.getImgUrl());
            }
        } catch (Exception e) {
            // Continua com a deleção mesmo se não conseguir deletar a imagem
        }

        eventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Admin - Upload apenas de imagem
    @PostMapping("/admin/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadImage(@RequestParam("imagem") MultipartFile imagem) {
        try {
            String imageUrl = fileUploadService.uploadImage(imagem);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro no upload: " + e.getMessage());
        }
    }
}