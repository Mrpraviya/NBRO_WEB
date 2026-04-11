package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ancillary_building")
public class AncillaryBuilding {

    @Id
    private UUID structureId;

    private UUID siteId;
    private String buildingType;

    private Instant createdAt;
    private Instant updatedAt;
}
