package com.escola.marketing_api.controller;




import com.escola.marketing_api.model.SobreNos;
import com.escola.marketing_api.service.SobreNosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SobreNosController {

    @Autowired
    private SobreNosService sobreNosService;

    // Endpoint público
    @GetMapping("/sobre-nos")
    public ResponseEntity<SobreNos> getSobreNos() {
        SobreNos sobreNos = sobreNosService.findAtivo();
        return ResponseEntity.ok(sobreNos);
    }

    // Endpoints administrativos
    @GetMapping("/admin/sobre-nos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SobreNos>> getAllSobreNos() {
        List<SobreNos> sobreNosList = sobreNosService.findAll();
        return ResponseEntity.ok(sobreNosList);
    }

    @GetMapping("/admin/sobre-nos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SobreNos> getSobreNosById(@PathVariable Long id) {
        SobreNos sobreNos = sobreNosService.findById(id);
        return ResponseEntity.ok(sobreNos);
    }

    @PostMapping("/admin/sobre-nos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SobreNos> createSobreNos(@Valid @RequestBody SobreNos sobreNos) {
        SobreNos novoSobreNos = sobreNosService.save(sobreNos);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoSobreNos);
    }

    @PutMapping("/admin/sobre-nos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SobreNos> updateSobreNos(@PathVariable Long id,
                                                   @Valid @RequestBody SobreNos sobreNosDetails) {
        SobreNos sobreNosAtualizado = sobreNosService.update(id, sobreNosDetails);
        return ResponseEntity.ok(sobreNosAtualizado);
    }

    @DeleteMapping("/admin/sobre-nos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSobreNos(@PathVariable Long id) {
        sobreNosService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
