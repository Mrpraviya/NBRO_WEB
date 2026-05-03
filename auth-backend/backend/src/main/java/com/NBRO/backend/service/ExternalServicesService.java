package com.NBRO.backend.service;

import com.NBRO.backend.entity.ExternalServices;
import com.NBRO.backend.repository.ExternalServicesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ExternalServicesService {

    @Autowired
    private ExternalServicesRepository repo;

    public List<ExternalServices> getBySiteId(UUID siteId) {
        return repo.findBySiteId(siteId);
    }

    public ExternalServices getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}
