package com.NBRO.backend.controller;

import com.NBRO.backend.entity.GeneralObservation;
import com.NBRO.backend.service.GeneralObservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/observations")
@CrossOrigin
public class GeneralObservationController {

    @Autowired
    private GeneralObservationService service;

    @GetMapping("/site/{siteId}")
    public List<GeneralObservation> getBySiteId(@PathVariable UUID siteId) {
        return service.getBySiteId(siteId);
    }

    @GetMapping("/{id}")
    public GeneralObservation getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}
