package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "building_detail")
public class BuildingDetail {

    @Id
    private UUID buildingDetailId;

    private UUID detailTypeId;

    private Boolean front;
    private Boolean leftSide;
    private Boolean rightSide;
    private Boolean rear;
}