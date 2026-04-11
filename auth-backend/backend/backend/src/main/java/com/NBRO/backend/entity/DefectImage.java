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
}