package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.DynamicInsert;

import java.time.Instant;
import java.util.UUID;

@Entity
@DynamicInsert
@Table(name = "external_services")
public class ExternalServices {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID serviceId;

    private UUID siteId;

    private String pipeBornWaterSupply;
    private String sewageWaste;
    private String electricitySource;

    private Instant createdAt;
    private Instant updatedAt;

    // Getters and Setters
    public UUID getServiceId() { return serviceId; }
    public void setServiceId(UUID serviceId) { this.serviceId = serviceId; }

    public UUID getSiteId() { return siteId; }
    public void setSiteId(UUID siteId) { this.siteId = siteId; }

    public String getPipeBornWaterSupply() { return pipeBornWaterSupply; }
    public void setPipeBornWaterSupply(String pipeBornWaterSupply) { 
        this.pipeBornWaterSupply = pipeBornWaterSupply; 
    }

    public String getSewageWaste() { return sewageWaste; }
    public void setSewageWaste(String sewageWaste) { this.sewageWaste = sewageWaste; }

    public String getElectricitySource() { return electricitySource; }
    public void setElectricitySource(String electricitySource) { 
        this.electricitySource = electricitySource; 
    }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}