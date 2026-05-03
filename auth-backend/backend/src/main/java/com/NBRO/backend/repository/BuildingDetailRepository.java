package com.NBRO.backend.repository;

import com.NBRO.backend.entity.BuildingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BuildingDetailRepository extends JpaRepository<BuildingDetail, UUID> {
    List<BuildingDetail> findByDetailTypeId(UUID detailTypeId);
}