package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "defect_info")
public class DefectInfo {

    @Id
    private UUID infoId;

    private UUID defectId;

    private String remarks;
    private String length;
    private String width;
}