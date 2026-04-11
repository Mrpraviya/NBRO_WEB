package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "main_building")
public class MainBuilding {

    @Id
    private UUID buildingId;

    private UUID siteId;
    private String noFloors;
    private String syncStatus;

    private Instant createdAt;
    private Instant updatedAt;
}