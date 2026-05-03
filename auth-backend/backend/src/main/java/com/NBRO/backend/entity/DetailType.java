package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "detail_type")
public class DetailType {

    @Id
    private UUID detailTypeId;

    private UUID structureId;
    private String name;
}