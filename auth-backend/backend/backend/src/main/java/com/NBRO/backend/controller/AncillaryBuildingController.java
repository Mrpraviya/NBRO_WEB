package com.NBRO.backend.controller;

import com.NBRO.backend.entity.AncillaryBuilding;
import com.NBRO.backend.service.AncillaryBuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ancillary-buildings")
@CrossOrigin
public class AncillaryBuildingController {

    @Autowired
    private AncillaryBuildingService service;

    @GetMapping("/site/{siteId}")
    public List<AncillaryBuilding> getBySiteId(@PathVariable UUID siteId) {
        return service.getBySiteId(siteId);
    }

    @GetMapping("/{id}")
    public AncillaryBuilding getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}
