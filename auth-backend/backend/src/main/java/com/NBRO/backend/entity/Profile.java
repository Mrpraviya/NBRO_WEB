package com.NBRO.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.DynamicInsert;

import java.time.Instant;
import java.util.UUID;

@Entity
@DynamicInsert
@Table(name = "profile")
public class Profile {

    @Id
    private UUID id;

    private String fullName;
    private String role;
    private Boolean isActive;
    private Boolean mustChangePassword;

    private Instant createdAt;
    private Instant updatedAt;

    @JsonProperty("id")
    public UUID getId() { return id; }

    @JsonProperty("fullName")
    public String getFullName() { return fullName; }

    @JsonProperty("role")
    public String getRole() { return role; }

    @JsonProperty("isActive")
    public Boolean getIsActive() { return isActive; }

    @JsonProperty("mustChangePassword")
    public Boolean getMustChangePassword() { return mustChangePassword; }

    @JsonProperty("createdAt")
    public Instant getCreatedAt() { return createdAt; }

    @JsonProperty("updatedAt")
    public Instant getUpdatedAt() { return updatedAt; }
}
