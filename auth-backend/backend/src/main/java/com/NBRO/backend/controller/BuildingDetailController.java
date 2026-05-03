package com.NBRO.backend.controller;

import com.NBRO.backend.entity.BuildingDetail;
import com.NBRO.backend.service.BuildingDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/building-details")
@CrossOrigin
public class BuildingDetailController {

    @Autowired
    private BuildingDetailService service;

    @GetMapping("/detail-type/{detailTypeId}")
    public List<BuildingDetail> getByDetailTypeId(@PathVariable UUID detailTypeId) {
        return service.getByDetailTypeId(detailTypeId);
    }

    @GetMapping("/{id}")
    public BuildingDetail getById(@PathVariable UUID id) {
        return service.getById(id);
    }
}
