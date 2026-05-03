package com.NBRO.backend.controller;

import com.NBRO.backend.entity.Site;
import com.NBRO.backend.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin
public class SiteController {

    @Autowired
    private SiteService service;

    @GetMapping
    public List<Site> getAll() {
        return service.getAllSites();
    }

    @GetMapping("/{id}")
    public Site getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Site> getByUserId(@PathVariable UUID userId) {
        return service.getByUser(userId);
    }
}