package com.NBRO.backend.repository;

import com.NBRO.backend.entity.DefectInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DefectInfoRepository extends JpaRepository<DefectInfo, UUID> {
    List<DefectInfo> findByDefectId(UUID defectId);
}