package com.NBRO.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "site")
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "site_id")
    private UUID siteId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "owner_contact")
    private String ownerContact;

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

    @Column(name = "sync_status")
    private String syncStatus;

    // Store sectionsStatus as a JSON string
    @Column(name = "sections_status", columnDefinition = "jsonb")
    private String sectionsStatus;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    // Getters and Setters
    public UUID getSiteId() { return siteId; }
    public void setSiteId(UUID siteId) { this.siteId = siteId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerContact() { return ownerContact; }
    public void setOwnerContact(String ownerContact) { this.ownerContact = ownerContact; }

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

    public String getSyncStatus() { return syncStatus; }
    public void setSyncStatus(String syncStatus) { this.syncStatus = syncStatus; }

    public String getSectionsStatus() { return sectionsStatus; }
    public void setSectionsStatus(String sectionsStatus) { this.sectionsStatus = sectionsStatus; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}