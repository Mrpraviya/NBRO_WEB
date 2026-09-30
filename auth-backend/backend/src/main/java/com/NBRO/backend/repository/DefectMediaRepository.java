package com.NBRO.backend.repository;

import com.NBRO.backend.entity.DefectMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DefectMediaRepository extends JpaRepository<DefectMedia, UUID> {
    List<DefectMedia> findByDefectId(UUID defectId);
}