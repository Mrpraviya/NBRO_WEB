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

    // Getters and Setters
    public UUID getObservationId() { return observationId; }
    public void setObservationId(UUID observationId) { this.observationId = observationId; }

    public UUID getSiteId() { return siteId; }
    public void setSiteId(UUID siteId) { this.siteId = siteId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPresentCondition() { return presentCondition; }
    public void setPresentCondition(String presentCondition) { 
        this.presentCondition = presentCondition; 
    }

    public String getApproxAge() { return approxAge; }
    public void setApproxAge(String approxAge) { this.approxAge = approxAge; }

    public String getSyncStatus() { return syncStatus; }
    public void setSyncStatus(String syncStatus) { this.syncStatus = syncStatus; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}