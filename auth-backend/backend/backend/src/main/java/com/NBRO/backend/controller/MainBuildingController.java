package com.NBRO.backend.controller;

import com.NBRO.backend.entity.MainBuilding;
import com.NBRO.backend.service.MainBuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/main-buildings")
@CrossOrigin
public class MainBuildingController {

    @Autowired
    private MainBuildingService service;

    @GetMapping("/site/{siteId}")
    public List<MainBuilding> getBySiteId(@PathVariable UUID siteId) {
        return service.getBySiteId(siteId);
    }

    @GetMapping("/{id}")
    public MainBuilding getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}