package com.NBRO.backend.repository;

import com.NBRO.backend.entity.DetailType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DetailTypeRepository extends JpaRepository<DetailType, UUID> {
    List<DetailType> findByStructureId(UUID structureId);
}