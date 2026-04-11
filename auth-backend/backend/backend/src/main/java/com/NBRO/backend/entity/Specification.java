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
}