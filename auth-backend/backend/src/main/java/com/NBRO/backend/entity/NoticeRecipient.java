package com.NBRO.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import org.hibernate.annotations.DynamicInsert;

import java.time.Instant;
import java.util.UUID;

@Entity
@DynamicInsert
@Table(name = "notice_recipients", uniqueConstraints = {
        @UniqueConstraint(name = "notice_recipients_notice_id_officer_id_key", columnNames = {"notice_id", "officer_id"})
})
public class NoticeRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID noticeId;

    @Column(nullable = false)
    private UUID officerId;

    @Column(nullable = false)
    private Boolean isRead;

    private Instant readAt;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getNoticeId() { return noticeId; }
    public void setNoticeId(UUID noticeId) { this.noticeId = noticeId; }

    public UUID getOfficerId() { return officerId; }
    public void setOfficerId(UUID officerId) { this.officerId = officerId; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public Instant getReadAt() { return readAt; }
    public void setReadAt(Instant readAt) { this.readAt = readAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}