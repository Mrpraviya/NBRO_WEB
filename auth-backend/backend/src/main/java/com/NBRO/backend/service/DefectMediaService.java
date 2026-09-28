package com.NBRO.backend.service;

import com.NBRO.backend.entity.DefectMedia;
import com.NBRO.backend.repository.DefectMediaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DefectMediaService {

    private final DefectMediaRepository repo;

    public DefectMediaService(DefectMediaRepository repo) {
        this.repo = repo;
    }

    public List<DefectMedia> getAll() {
        return repo.findAll();
    }

    public List<DefectMedia> getByDefectId(UUID defectId) {
        return repo.findByDefectId(defectId);
    }

    public DefectMedia getById(@NonNull UUID id) {
        return repo.findById(id).orElseThrow();
    }

    public DefectMedia create(@NonNull DefectMedia media) {
        return repo.save(media);
    }

    public DefectMedia update(@NonNull UUID id, @NonNull DefectMedia media) {
        repo.findById(id).orElseThrow();
        media.setId(id);
        return repo.save(media);
    }

    public void delete(@NonNull UUID id) {
        repo.deleteById(id);
    }
}