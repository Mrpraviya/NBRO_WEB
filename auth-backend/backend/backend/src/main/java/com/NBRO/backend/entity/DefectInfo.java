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

    // Getters and Setters
    public UUID getInfoId() { return infoId; }
    public void setInfoId(UUID infoId) { this.infoId = infoId; }

    public UUID getDefectId() { return defectId; }
    public void setDefectId(UUID defectId) { this.defectId = defectId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getLength() { return length; }
    public void setLength(String length) { this.length = length; }

    public String getWidth() { return width; }
    public void setWidth(String width) { this.width = width; }

    @Override
    public String toString() {
        return "DefectInfo{" +
                "remarks='" + remarks + '\'' +
                ", length='" + length + '\'' +
                ", width='" + width + '\'' +
                '}';
    }
}