package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.DynamicInsert;

import java.util.UUID;

@Entity
@DynamicInsert
@Table(name = "building_detail")
public class BuildingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID buildingDetailId;

    private UUID detailTypeId;

    private Boolean front;
    private Boolean leftSide;
    private Boolean rightSide;
    private Boolean rear;
}