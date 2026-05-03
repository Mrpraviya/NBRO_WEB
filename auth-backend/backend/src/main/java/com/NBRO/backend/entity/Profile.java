package com.NBRO.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
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
}
