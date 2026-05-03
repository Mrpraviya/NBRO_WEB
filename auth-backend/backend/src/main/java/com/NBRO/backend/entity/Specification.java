package com.NBRO.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "specification")
public class Specification {

    @Id
    private UUID specId;

    private UUID buildingId;

    private Boolean isUsed;
    private String elementType;

    @Column(columnDefinition = "jsonb")
    private String elementProperties;

    @Column(columnDefinition = "jsonb")
    private String floorDetails;

    // Getters and Setters
    public UUID getSpecId() { return specId; }
    public void setSpecId(UUID specId) { this.specId = specId; }

    public UUID getBuildingId() { return buildingId; }
    public void setBuildingId(UUID buildingId) { this.buildingId = buildingId; }

    public Boolean getIsUsed() { return isUsed; }
    public void setIsUsed(Boolean isUsed) { this.isUsed = isUsed; }

    public String getElementType() { return elementType; }
    public void setElementType(String elementType) { this.elementType = elementType; }

    public String getElementProperties() { return elementProperties; }
    public void setElementProperties(String elementProperties) { 
        this.elementProperties = elementProperties; 
    }

    public String getFloorDetails() { return floorDetails; }
    public void setFloorDetails(String floorDetails) { this.floorDetails = floorDetails; }

    // Helper method to get display name for specification
    public String getSpecType() {
        return elementType != null ? elementType : "Unknown";
    }

    public String getSpecDetails() {
        return elementProperties != null ? elementProperties : "No details available";
    }
}