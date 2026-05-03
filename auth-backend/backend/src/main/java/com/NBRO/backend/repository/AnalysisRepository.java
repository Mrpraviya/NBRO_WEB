package com.NBRO.backend.repository;

import com.NBRO.backend.entity.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, UUID> {
    List<Analysis> findBySiteId(UUID siteId);
    List<Analysis> findByUserId(UUID userId);
    List<Analysis> findBySiteIdAndUserId(UUID siteId, UUID userId);
}
