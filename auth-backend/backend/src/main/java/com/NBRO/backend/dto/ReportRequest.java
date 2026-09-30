package com.NBRO.backend.dto;

import java.util.UUID;

public class ReportRequest {

    private UUID siteId;
    private UUID userId;
    private String reportTitle;
    private String notes;

    // Constructors
    public ReportRequest() {}

    public ReportRequest(UUID siteId, UUID userId, String reportTitle) {
        this.siteId = siteId;
        this.userId = userId;
        this.reportTitle = reportTitle;
    }

    // Getters and Setters
    public UUID getSiteId() { return siteId; }
    public void setSiteId(UUID siteId) { this.siteId = siteId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getReportTitle() { return reportTitle; }
    public void setReportTitle(String reportTitle) { this.reportTitle = reportTitle; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
