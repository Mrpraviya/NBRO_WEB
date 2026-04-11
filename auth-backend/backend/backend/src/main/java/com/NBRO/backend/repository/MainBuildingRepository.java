package com.NBRO.backend.repository;

import com.NBRO.backend.entity.MainBuilding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MainBuildingRepository extends JpaRepository<MainBuilding, UUID> {
    List<MainBuilding> findBySiteId(UUID siteId);
}