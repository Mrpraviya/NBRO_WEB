package com.NBRO.backend.controller;

import com.NBRO.backend.entity.DetailType;
import com.NBRO.backend.service.DetailTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/detail-types")
@CrossOrigin
public class DetailTypeController {

    @Autowired
    private DetailTypeService service;

    @GetMapping("/structure/{structureId}")
    public List<DetailType> getByStructureId(@PathVariable UUID structureId) {
        return service.getByStructureId(structureId);
    }

    @GetMapping("/{id}")
    public DetailType getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}