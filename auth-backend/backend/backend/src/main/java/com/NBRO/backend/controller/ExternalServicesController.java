package com.NBRO.backend.controller;

import com.NBRO.backend.entity.ExternalServices;
import com.NBRO.backend.service.ExternalServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/external-services")
@CrossOrigin
public class ExternalServicesController {

    @Autowired
    private ExternalServicesService service;

    @GetMapping("/site/{siteId}")
    public List<ExternalServices> getBySiteId(@PathVariable UUID siteId) {
        return service.getBySiteId(siteId);
    }

    @GetMapping("/{id}")
    public ExternalServices getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}