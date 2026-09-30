package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.DynamicInsert;

import java.time.Instant;
import java.util.UUID;

@Entity
@DynamicInsert
@Table(name = "ancillary_building")
public class AncillaryBuilding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID structureId;

    private UUID siteId;
    private String buildingType;

    private Instant createdAt;
    private Instant updatedAt;

    // Getters and Setters
    public UUID getStructureId() { return structureId; }
    public void setStructureId(UUID structureId) { this.structureId = structureId; }

    public UUID getSiteId() { return siteId; }
    public void setSiteId(UUID siteId) { this.siteId = siteId; }

    public String getBuildingType() { return buildingType; }
    public void setBuildingType(String buildingType) { this.buildingType = buildingType; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    // Alias for compatibility with PDF generation
    public UUID getBuildingId() { return structureId; }
    public String getType() { return buildingType; }

    public String getSyncStatus() {
        return "";
    }
}
