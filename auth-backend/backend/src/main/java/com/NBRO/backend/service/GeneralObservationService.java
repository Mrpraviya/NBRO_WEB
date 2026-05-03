package com.NBRO.backend.service;

import com.NBRO.backend.entity.GeneralObservation;
import com.NBRO.backend.repository.GeneralObservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GeneralObservationService {

    @Autowired
    private GeneralObservationRepository repo;

    public List<GeneralObservation> getBySiteId(UUID siteId) {
        return repo.findBySiteId(siteId);
    }

    public GeneralObservation getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}