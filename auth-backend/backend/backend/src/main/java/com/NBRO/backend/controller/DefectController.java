package com.NBRO.backend.controller;

import com.NBRO.backend.entity.Defect;
import com.NBRO.backend.service.DefectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/defects")
@CrossOrigin
public class DefectController {

    @Autowired
    private DefectService service;

    @GetMapping("/site/{siteId}")
    public List<Defect> getBySiteId(@PathVariable UUID siteId) {
        return service.getBySiteId(siteId);
    }

    @GetMapping("/{id}")
    public Defect getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}