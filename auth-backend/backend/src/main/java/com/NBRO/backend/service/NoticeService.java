package com.NBRO.backend.service;

import com.NBRO.backend.entity.Notice;
import com.NBRO.backend.repository.NoticeRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NoticeService {

    private final NoticeRepository repo;

    public NoticeService(NoticeRepository repo) {
        this.repo = repo;
    }

    public List<Notice> getAll() {
        return repo.findAll();
    }

    public Notice getById(@NonNull UUID id) {
        return repo.findById(id).orElseThrow();
    }

    public Notice create(@NonNull Notice notice) {
        return repo.save(notice);
    }

    public Notice update(@NonNull UUID id, @NonNull Notice notice) {
        repo.findById(id).orElseThrow();
        notice.setId(id);
        return repo.save(notice);
    }

    public void delete(@NonNull UUID id) {
        repo.deleteById(id);
    }
}