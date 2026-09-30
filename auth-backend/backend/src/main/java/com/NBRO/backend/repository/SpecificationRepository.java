package com.NBRO.backend.repository;

import com.NBRO.backend.entity.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SpecificationRepository extends JpaRepository<Specification, UUID> {
    List<Specification> findByBuildingId(UUID buildingId);
}