package com.NBRO.backend.repository;

import com.NBRO.backend.entity.GeneralObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GeneralObservationRepository extends JpaRepository<GeneralObservation, UUID> {
    List<GeneralObservation> findBySiteId(UUID siteId);
}