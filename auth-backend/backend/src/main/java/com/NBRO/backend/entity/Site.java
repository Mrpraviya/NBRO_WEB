package com.NBRO.backend.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;
import java.time.Instant;
import java.util.UUID;

@Entity
@DynamicInsert
@Table(name = "site")
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "site_id")
    private UUID siteId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "owner_contact")
    private String ownerContact;

    @JdbcTypeCode(SqlTypes.GEOGRAPHY)
    @Column(name = "location", columnDefinition = "geography(Point,4326)")
    private Point location;

    @Column(name = "address")
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "building_ref")
    private String buildingRef;

    @Column(name = "distance_from_row")
    private Double distanceFromRow;

    @Column(name = "building_photo_url")
    private String buildingPhotoUrl;

    @Column(name = "building_photo_path")
    private String buildingPhotoPath;

    @Column(name = "sync_status")
    private String syncStatus;

    // Store sectionsStatus as a JSON string
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "sections_status", columnDefinition = "jsonb")
    private JsonNode sectionsStatus;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "updated_by")
    private UUID updatedBy;

    // Getters and Setters
    public UUID getSiteId() { return siteId; }
    public void setSiteId(UUID siteId) { this.siteId = siteId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerContact() { return ownerContact; }
    public void setOwnerContact(String ownerContact) { this.ownerContact = ownerContact; }

    @JsonIgnore
    public Point getLocation() { return location; }
    public void setLocation(Point location) { this.location = location; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getBuildingRef() { return buildingRef; }
    public void setBuildingRef(String buildingRef) { this.buildingRef = buildingRef; }

    public Double getDistanceFromRow() { return distanceFromRow; }
    public void setDistanceFromRow(Double distanceFromRow) { this.distanceFromRow = distanceFromRow; }

    public String getBuildingPhotoUrl() { return buildingPhotoUrl; }
    public void setBuildingPhotoUrl(String buildingPhotoUrl) { this.buildingPhotoUrl = buildingPhotoUrl; }

    public String getBuildingPhotoPath() { return buildingPhotoPath; }
    public void setBuildingPhotoPath(String buildingPhotoPath) { this.buildingPhotoPath = buildingPhotoPath; }

    public String getSyncStatus() { return syncStatus; }
    public void setSyncStatus(String syncStatus) { this.syncStatus = syncStatus; }

    public JsonNode getSectionsStatus() { return sectionsStatus; }
    public void setSectionsStatus(JsonNode sectionsStatus) { this.sectionsStatus = sectionsStatus; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}