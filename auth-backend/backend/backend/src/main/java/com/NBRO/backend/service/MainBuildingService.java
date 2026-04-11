package com.NBRO.backend.service;

import com.NBRO.backend.entity.MainBuilding;
import com.NBRO.backend.repository.MainBuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MainBuildingService {

    @Autowired
    private MainBuildingRepository repo;

    public List<MainBuilding> getBySiteId(UUID siteId) {
        return repo.findBySiteId(siteId);
    }

    public MainBuilding getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}