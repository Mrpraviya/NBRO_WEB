package com.NBRO.backend.service;

import com.NBRO.backend.entity.DefectImage;
import com.NBRO.backend.repository.DefectImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DefectImageService {

    @Autowired
    private DefectImageRepository repo;

    public List<DefectImage> getByInfoId(UUID infoId) {
        return repo.findByInfoId(infoId);
    }

    public DefectImage getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}