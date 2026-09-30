package com.NBRO.backend.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "specification")
public class Specification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID specId;

    private UUID buildingId;

    private Boolean isUsed;
    private String elementType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode elementProperties;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode floorDetails;

    // Getters and Setters
    public UUID getSpecId() { return specId; }
    public void setSpecId(UUID specId) { this.specId = specId; }

    public UUID getBuildingId() { return buildingId; }
    public void setBuildingId(UUID buildingId) { this.buildingId = buildingId; }

    public Boolean getIsUsed() { return isUsed; }
    public void setIsUsed(Boolean isUsed) { this.isUsed = isUsed; }

    public String getElementType() { return elementType; }
    public void setElementType(String elementType) { this.elementType = elementType; }

    public JsonNode getElementProperties() { return elementProperties; }
    public void setElementProperties(JsonNode elementProperties) {
        this.elementProperties = elementProperties; 
    }

    public JsonNode getFloorDetails() { return floorDetails; }
    public void setFloorDetails(JsonNode floorDetails) { this.floorDetails = floorDetails; }

    // Helper method to get display name for specification
    public String getSpecType() {
        return elementType != null ? elementType : "Unknown";
    }

    public String getSpecDetails() {
        return elementProperties != null ? elementProperties.toString() : "No details available";
    }
}