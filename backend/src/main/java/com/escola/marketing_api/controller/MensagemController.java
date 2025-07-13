package com.escola.marketing_api.controller;

import com.escola.marketing_api.dto.MensaContDTO;
import com.escola.marketing_api.service.MensagemService;
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


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    // Endpoint público para envio de mensagens
    @PostMapping("/contato")
    public ResponseEntity<MensaContDTO> enviarMensagem(@Valid @RequestBody MensaContDTO mensagemDTO) {
        MensaContDTO novaMensagem = mensagemService.save(mensagemDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMensagem);
    }

    // Endpoints administrativos
    @GetMapping("/admin/mensagens")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MensaContDTO>> getAllMensagens() {
        // Este endpoint retorna todas as mensagens sem paginação.
        // Se a intenção é ter paginação aqui, use o método getMensagensPaginated.
        // Caso contrário, o findAll() no serviço deve retornar List<MensaContDTO>
        // como está atualmente.
        List<MensaContDTO> mensagens = mensagemService.findAll();
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/admin/mensagens/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<MensaContDTO>> getMensagensPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataCriacao") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<MensaContDTO> mensagens = mensagemService.findAllPaginated(pageable);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/admin/mensagens/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MensaContDTO> getMensagemById(@PathVariable Long id) {
        MensaContDTO mensagem = mensagemService.findById(id);
        return ResponseEntity.ok(mensagem);
    }


 /*   @GetMapping("/admin/mensagens/pendentes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MensaContDTO>> getMensagensPendentes() {
        List<MensaContDTO> mensagens = mensagemService.findPendentes();
        return ResponseEntity.ok(mensagens);
    }
*/
    @PutMapping("/admin/mensagens/{id}/responder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MensaContDTO> responderMensagem(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        String resposta = (String) payload.get("resposta");
        Long adminId = Long.valueOf(payload.get("adminId").toString());

        MensaContDTO mensagemRespondida = mensagemService.responder(id, resposta, adminId);
        return ResponseEntity.ok(mensagemRespondida);
    }


    @DeleteMapping("/admin/mensagens/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMensagem(@PathVariable Long id) {
        mensagemService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
