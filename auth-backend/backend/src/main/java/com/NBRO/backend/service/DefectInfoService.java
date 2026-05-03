package com.NBRO.backend.service;

import com.NBRO.backend.entity.DefectInfo;
import com.NBRO.backend.repository.DefectInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DefectInfoService {

    @Autowired
    private DefectInfoRepository repo;

    public List<DefectInfo> getByDefectId(UUID defectId) {
        return repo.findByDefectId(defectId);
    }

    public DefectInfo getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}
