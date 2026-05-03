package com.NBRO.backend.repository;

import com.NBRO.backend.entity.DefectImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DefectImageRepository extends JpaRepository<DefectImage, UUID> {
    List<DefectImage> findByInfoId(UUID infoId);
}