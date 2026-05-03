package com.NBRO.backend.service;

import com.NBRO.backend.entity.AncillaryBuilding;
import com.NBRO.backend.repository.AncillaryBuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AncillaryBuildingService {

    @Autowired
    private AncillaryBuildingRepository repo;

    public List<AncillaryBuilding> getBySiteId(UUID siteId) {
        return repo.findBySiteId(siteId);
    }

    public AncillaryBuilding getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}
