package com.NBRO.backend.controller;

import com.NBRO.backend.dto.ReportRequest;
import com.NBRO.backend.dto.ReportResponse;
import com.NBRO.backend.entity.Analysis;
import com.NBRO.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Create an analysis order and generate PDF report
     * POST /api/reports/generate
     * 
     * Request body:
     * {
     *   "siteId": "uuid",
     *   "userId": "uuid",
     *   "reportTitle": "Custom Report Title",
     *   "notes": "Optional notes"
     * }
     */
    @PostMapping("/generate")
    public ResponseEntity<ReportResponse> generateReport(@RequestBody ReportRequest request) {
        try {
            if (request.getSiteId() == null || request.getUserId() == null) {
                ReportResponse error = new ReportResponse();
                error.setStatus("ERROR");
                error.setMessage("siteId and userId are required");
                return ResponseEntity.badRequest().body(error);
            }

            // Create analysis order and generate PDF
            Analysis analysis = reportService.createAnalysisOrder(request);

            // Create response
            ReportResponse response = new ReportResponse();
            response.setAnalysisId(analysis.getAnalysisId());
            response.setSiteId(analysis.getSiteId());
            response.setReportTitle(analysis.getReportTitle());
            response.setStatus(analysis.getStatus());
            response.setPdfPath(analysis.getPdfPath());
            response.setCreatedAt(analysis.getCreatedAt());
            response.setMessage("Report generated successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            ReportResponse error = new ReportResponse();
            error.setStatus("ERROR");
            error.setMessage("Failed to generate report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            ReportResponse error = new ReportResponse();
            error.setStatus("ERROR");
            error.setMessage("Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Download generated PDF report
     * GET /api/reports/{analysisId}/download
     */
    @GetMapping("/{analysisId}/download")
    public ResponseEntity<Resource> downloadReport(@PathVariable UUID analysisId) {
        try {
            Optional<Analysis> analysis = reportService.getAnalysisById(analysisId);

            if (analysis.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Analysis report = analysis.get();
            File file = new File(report.getPdfPath());

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(file);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + file.getName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get analysis/report by ID
     * GET /api/reports/{analysisId}
     */
    @GetMapping("/{analysisId}")
    public ResponseEntity<ReportResponse> getReport(@PathVariable UUID analysisId) {
        try {
            Optional<Analysis> analysis = reportService.getAnalysisById(analysisId);

            if (analysis.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ReportResponse response = convertToResponse(analysis.get());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all analyses for a specific site
     * GET /api/reports/site/{siteId}
     */
    @GetMapping("/site/{siteId}")
    public ResponseEntity<List<ReportResponse>> getReportsBySite(@PathVariable UUID siteId) {
        try {
            List<Analysis> analyses = reportService.getAnalysesBySite(siteId);
            List<ReportResponse> responses = analyses.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all analyses for a specific user
     * GET /api/reports/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReportResponse>> getReportsByUser(@PathVariable UUID userId) {
        try {
            List<Analysis> analyses = reportService.getAnalysesByUser(userId);
            List<ReportResponse> responses = analyses.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Helper method to convert Analysis entity to ReportResponse DTO
     */
    private ReportResponse convertToResponse(Analysis analysis) {
        ReportResponse response = new ReportResponse();
        response.setAnalysisId(analysis.getAnalysisId());
        response.setSiteId(analysis.getSiteId());
        response.setReportTitle(analysis.getReportTitle());
        response.setStatus(analysis.getStatus());
        response.setPdfPath(analysis.getPdfPath());
        response.setCreatedAt(analysis.getCreatedAt());
        response.setMessage("Analysis report");
        return response;
    }
}
