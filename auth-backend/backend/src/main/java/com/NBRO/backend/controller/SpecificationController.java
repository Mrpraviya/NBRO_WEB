package com.NBRO.backend.controller;

import com.NBRO.backend.entity.Specification;
import com.NBRO.backend.service.SpecificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/specifications")
@CrossOrigin
public class SpecificationController {

    @Autowired
    private SpecificationService service;

    @GetMapping("/building/{buildingId}")
    public List<Specification> getByBuildingId(@PathVariable UUID buildingId) {
        return service.getByBuildingId(buildingId);
    }

    @GetMapping("/{id}")
    public Specification getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}
