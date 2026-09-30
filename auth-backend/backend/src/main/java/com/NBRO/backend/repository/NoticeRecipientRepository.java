package com.NBRO.backend.repository;

import com.NBRO.backend.entity.NoticeRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoticeRecipientRepository extends JpaRepository<NoticeRecipient, UUID> {
    List<NoticeRecipient> findByNoticeId(UUID noticeId);
    List<NoticeRecipient> findByOfficerId(UUID officerId);
}