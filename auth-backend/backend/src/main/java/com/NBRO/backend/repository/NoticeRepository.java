package com.NBRO.backend.repository;

import com.NBRO.backend.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, UUID> {
}