package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "defects")
public class Defect {

    @Id
    private UUID defectId;

    private UUID siteId;
    private String syncStatus;

    private Instant createdAt;
    private Instant updatedAt;
}
