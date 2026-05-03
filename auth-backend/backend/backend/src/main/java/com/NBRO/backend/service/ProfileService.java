package com.NBRO.backend.service;

import com.NBRO.backend.entity.Profile;
import com.NBRO.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository repo;

    public List<Profile> getAll() {
        return repo.findAll();
    }

    public Profile getById(UUID id) {
        return repo.findById(id).orElseThrow();
    }
}