package com.NBRO.backend.controller;

import com.NBRO.backend.entity.DefectMedia;
import com.NBRO.backend.service.DefectMediaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/defect-media")
@CrossOrigin
public class DefectMediaController {

    private final DefectMediaService service;

    public DefectMediaController(DefectMediaService service) {
        this.service = service;
    }

    @GetMapping
    public List<DefectMedia> getAll() {
        return service.getAll();
    }

    @GetMapping("/defect/{defectId}")
    public List<DefectMedia> getByDefectId(@PathVariable @org.springframework.lang.NonNull UUID defectId) {
        return service.getByDefectId(defectId);
    }

    @GetMapping("/{id}")
    public DefectMedia getById(@PathVariable @org.springframework.lang.NonNull UUID id) {
        return service.getById(id);
    }

    @PostMapping
    public DefectMedia create(@RequestBody @org.springframework.lang.NonNull DefectMedia media) {
        return service.create(media);
    }

    @PutMapping("/{id}")
    public DefectMedia update(@PathVariable @org.springframework.lang.NonNull UUID id,
                              @RequestBody @org.springframework.lang.NonNull DefectMedia media) {
        return service.update(id, media);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @org.springframework.lang.NonNull UUID id) {
        service.delete(id);
    }
}