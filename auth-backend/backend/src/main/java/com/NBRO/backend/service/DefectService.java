package com.NBRO.backend.service;

import com.NBRO.backend.entity.Defect;
import com.NBRO.backend.repository.DefectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DefectService {

    @Autowired
    private DefectRepository repo;

    public List<Defect> getBySiteId(UUID siteId) {
        return repo.findBySiteId(siteId);
    }

    public Defect getById(@NonNull UUID id) {
        return repo.findById(id).orElseThrow();
    }
}