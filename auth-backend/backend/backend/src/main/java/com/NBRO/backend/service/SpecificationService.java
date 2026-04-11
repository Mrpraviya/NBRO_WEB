package com.NBRO.backend.service;

import com.NBRO.backend.entity.Specification;
import com.NBRO.backend.repository.SpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SpecificationService {

    @Autowired
    private SpecificationRepository repo;

    public List<Specification> getByBuildingId(UUID buildingId) {
        return repo.findByBuildingId(buildingId);
    }

    public Specification getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}