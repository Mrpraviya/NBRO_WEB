package com.NBRO.backend.repository;

import com.NBRO.backend.entity.Defect;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DefectRepository extends JpaRepository<Defect, UUID> {
    List<Defect> findBySiteId(UUID siteId);
}