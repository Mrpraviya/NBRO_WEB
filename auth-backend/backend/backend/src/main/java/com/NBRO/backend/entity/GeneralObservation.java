package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "general_observation")
public class GeneralObservation {

    @Id
    private UUID observationId;

    private UUID siteId;

    private String type;
    private String presentCondition;
    private String approxAge;

    private String syncStatus;

    private Instant createdAt;
    private Instant updatedAt;
}