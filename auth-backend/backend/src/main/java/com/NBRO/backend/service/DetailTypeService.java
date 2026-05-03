package com.NBRO.backend.service;

import com.NBRO.backend.entity.DetailType;
import com.NBRO.backend.repository.DetailTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DetailTypeService {

    @Autowired
    private DetailTypeRepository repo;

    public List<DetailType> getByStructureId(UUID structureId) {
        return repo.findByStructureId(structureId);
    }

    public DetailType getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}