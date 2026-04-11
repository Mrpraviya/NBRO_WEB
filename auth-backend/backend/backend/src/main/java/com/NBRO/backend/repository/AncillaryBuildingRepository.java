package com.NBRO.backend.repository;

import com.NBRO.backend.entity.AncillaryBuilding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AncillaryBuildingRepository extends JpaRepository<AncillaryBuilding, UUID> {
    List<AncillaryBuilding> findBySiteId(UUID siteId);
}