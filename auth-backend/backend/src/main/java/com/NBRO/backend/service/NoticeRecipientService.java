package com.NBRO.backend.service;

import com.NBRO.backend.entity.NoticeRecipient;
import com.NBRO.backend.repository.NoticeRecipientRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NoticeRecipientService {

    private final NoticeRecipientRepository repo;

    public NoticeRecipientService(NoticeRecipientRepository repo) {
        this.repo = repo;
    }

    public List<NoticeRecipient> getAll() {
        return repo.findAll();
    }

    public List<NoticeRecipient> getByNoticeId(UUID noticeId) {
        return repo.findByNoticeId(noticeId);
    }

    public List<NoticeRecipient> getByOfficerId(UUID officerId) {
        return repo.findByOfficerId(officerId);
    }

    public NoticeRecipient getById(@NonNull UUID id) {
        return repo.findById(id).orElseThrow();
    }

    public NoticeRecipient create(@NonNull NoticeRecipient recipient) {
        return repo.save(recipient);
    }

    public NoticeRecipient update(@NonNull UUID id, @NonNull NoticeRecipient recipient) {
        repo.findById(id).orElseThrow();
        recipient.setId(id);
        return repo.save(recipient);
    }

    public void delete(@NonNull UUID id) {
        repo.deleteById(id);
    }
}