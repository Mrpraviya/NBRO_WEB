package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "detail_type")
public class DetailType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID detailTypeId;

    private UUID structureId;
    private String name;

    public UUID getDetailTypeId() { return detailTypeId; }
    public UUID getStructureId() { return structureId; }
    public String getName() { return name; }
}