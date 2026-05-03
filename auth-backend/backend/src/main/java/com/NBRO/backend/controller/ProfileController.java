package com.NBRO.backend.controller;

import com.NBRO.backend.entity.Profile;
import com.NBRO.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin
public class ProfileController {

    @Autowired
    private ProfileService service;

    @GetMapping
    public List<Profile> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Profile getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}
