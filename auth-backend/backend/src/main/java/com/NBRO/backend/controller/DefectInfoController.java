package com.NBRO.backend.controller;

import com.NBRO.backend.entity.DefectInfo;
import com.NBRO.backend.service.DefectInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/defect-info")
@CrossOrigin
public class DefectInfoController {

    @Autowired
    private DefectInfoService service;

    @GetMapping("/defect/{defectId}")
    public List<DefectInfo> getByDefectId(@PathVariable UUID defectId) {
        return service.getByDefectId(defectId);
    }

    @GetMapping("/{id}")
    public DefectInfo getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}
