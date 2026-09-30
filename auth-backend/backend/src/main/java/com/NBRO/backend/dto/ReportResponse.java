package com.NBRO.backend.dto;

import java.time.Instant;
import java.util.UUID;

public class ReportResponse {

    private UUID analysisId;
    private UUID siteId;
    private String reportTitle;
    private String status;
    private String pdfPath;
    private Instant createdAt;
    private String message;

    // Constructors
    public ReportResponse() {}

    public ReportResponse(UUID analysisId, String status, String message) {
        this.analysisId = analysisId;
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public UUID getAnalysisId() { return analysisId; }
    public void setAnalysisId(UUID analysisId) { this.analysisId = analysisId; }

    public UUID getSiteId() { return siteId; }
    public void setSiteId(UUID siteId) { this.siteId = siteId; }

    public String getReportTitle() { return reportTitle; }
    public void setReportTitle(String reportTitle) { this.reportTitle = reportTitle; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPdfPath() { return pdfPath; }
    public void setPdfPath(String pdfPath) { this.pdfPath = pdfPath; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
