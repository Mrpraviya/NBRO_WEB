package com.NBRO.backend.service;

import com.NBRO.backend.entity.Site;
import com.NBRO.backend.repository.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SiteService {

    @Autowired
    private SiteRepository repo;

    public List<Site> getAllSites() {
        return repo.findAll();
    }

    public Site getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }

    public List<Site> getByUser(UUID userId) {
        return repo.findByUserId(userId);
    }
}