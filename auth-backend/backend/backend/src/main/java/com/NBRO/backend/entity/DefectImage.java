package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "defect_image")
public class DefectImage {

    @Id
    private UUID imageId;

    private UUID infoId;

    private String imageUrl;
    private String imagePath;
    private String syncStatus;

    private Instant createdAt;
    private Instant updatedAt;

    // Getters and Setters
    public UUID getImageId() { return imageId; }
    public void setImageId(UUID imageId) { this.imageId = imageId; }

    public UUID getInfoId() { return infoId; }
    public void setInfoId(UUID infoId) { this.infoId = infoId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getSyncStatus() { return syncStatus; }
    public void setSyncStatus(String syncStatus) { this.syncStatus = syncStatus; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}