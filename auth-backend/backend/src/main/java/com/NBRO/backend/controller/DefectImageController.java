package com.NBRO.backend.controller;

import com.NBRO.backend.entity.DefectImage;
import com.NBRO.backend.service.DefectImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/defect-images")
@CrossOrigin
public class DefectImageController {

    @Autowired
    private DefectImageService service;

    @GetMapping("/info/{infoId}")
    public List<DefectImage> getByInfoId(@PathVariable UUID infoId) {
        return service.getByInfoId(infoId);
    }

    @GetMapping("/{id}")
    public DefectImage getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}