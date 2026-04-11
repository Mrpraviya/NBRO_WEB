package com.NBRO.backend.service;

import com.NBRO.backend.entity.BuildingDetail;
import com.NBRO.backend.repository.BuildingDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BuildingDetailService {

    @Autowired
    private BuildingDetailRepository repo;

    public List<BuildingDetail> getByDetailTypeId(UUID detailTypeId) {
        return repo.findByDetailTypeId(detailTypeId);
    }

    public BuildingDetail getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}