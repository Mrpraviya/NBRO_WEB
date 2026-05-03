package com.NBRO.backend.service;

import com.NBRO.backend.dto.ReportRequest;
import com.NBRO.backend.entity.*;
import com.NBRO.backend.repository.*;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
public class ReportService {

    private static final String REPORTS_DIRECTORY = "uploads/reports/";
    private static final DateTimeFormatter formatter = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneId.systemDefault());

    @Autowired
    private AnalysisRepository analysisRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private MainBuildingRepository mainBuildingRepository;

    @Autowired
    private AncillaryBuildingRepository ancillaryBuildingRepository;

    @Autowired
    private GeneralObservationRepository generalObservationRepository;

    @Autowired
    private DefectRepository defectRepository;

    @Autowired
    private DefectInfoRepository defectInfoRepository;

    @Autowired
    private DefectImageRepository defectImageRepository;

    @Autowired
    private ExternalServicesRepository externalServicesRepository;

    @Autowired
    private SpecificationRepository specificationRepository;

    public ReportService() {
        // Ensure reports directory exists
        File reportsDir = new File(REPORTS_DIRECTORY);
        if (!reportsDir.exists()) {
            reportsDir.mkdirs();
        }
    }

    /**
     * Create an analysis order and generate PDF report
     */
    public Analysis createAnalysisOrder(ReportRequest request) throws IOException {
        // Create Analysis record
        Analysis analysis = new Analysis();
        analysis.setAnalysisId(UUID.randomUUID());
        analysis.setSiteId(request.getSiteId());
        analysis.setUserId(request.getUserId());
        analysis.setReportTitle(request.getReportTitle() != null ? 
            request.getReportTitle() : "Analysis Report - " + request.getSiteId());
        analysis.setNotes(request.getNotes());
        analysis.setStatus("PENDING");

        // Generate PDF
        String pdfPath = generatePDF(request.getSiteId(), analysis.getAnalysisId(), analysis.getReportTitle());
        
        analysis.setPdfPath(pdfPath);
        analysis.setStatus("GENERATED");

        // Save and return
        return analysisRepository.save(analysis);
    }

    /**
     * Generate PDF report from site data
     */
    private String generatePDF(UUID siteId, UUID analysisId, String reportTitle) throws IOException {
        // Fetch site data
        Site site = siteRepository.findById(siteId)
            .orElseThrow(() -> new IllegalArgumentException("Site not found: " + siteId));

        // Create PDF file
        String fileName = "Report_" + analysisId + "_" + System.currentTimeMillis() + ".pdf";
        String filePath = REPORTS_DIRECTORY + fileName;

        // Create document with OpenPDF
        Document document = new Document(PageSize.A4);
        FileOutputStream fos = new FileOutputStream(filePath);
        PdfWriter.getInstance(document, fos);
        document.open();

        try {
            // Title
            Paragraph title = new Paragraph(reportTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            title.getFont().setSize(24);
            title.getFont().setStyle(Font.BOLD);
            document.add(title);

            // Report metadata
            document.add(new Paragraph("\n"));
            document.add(createMetadataTable(site, analysisId));

            // Site Information Section
            document.add(new Paragraph("\nSITE INFORMATION"));
            document.add(createSiteInfoTable(site));

            // Main Building Information
            List<MainBuilding> mainBuildings = mainBuildingRepository.findBySiteId(siteId);
            if (!mainBuildings.isEmpty()) {
                document.add(new Paragraph("\nMAIN BUILDING"));
                for (MainBuilding building : mainBuildings) {
                    document.add(createMainBuildingTable(building));
                }
            }

            // Ancillary Buildings
            List<AncillaryBuilding> ancillaryBuildings = ancillaryBuildingRepository.findBySiteId(siteId);
            if (!ancillaryBuildings.isEmpty()) {
                document.add(new Paragraph("\nANCILLARY BUILDINGS"));
                for (AncillaryBuilding building : ancillaryBuildings) {
                    document.add(createAncillaryBuildingTable(building));
                }
            }

            // General Observations
            List<GeneralObservation> observations = generalObservationRepository.findBySiteId(siteId);
            if (!observations.isEmpty()) {
                document.add(new Paragraph("\nGENERAL OBSERVATIONS"));
                document.add(createObservationsTable(observations));
            }

            // Defects
            List<Defect> defects = defectRepository.findBySiteId(siteId);
            if (!defects.isEmpty()) {
                document.add(new Paragraph("\nDEFECTS"));
                for (Defect defect : defects) {
                    document.add(createDefectTable(defect));
                    
                    // Add defect images - fetch by defect ID through defect info
                    List<DefectInfo> defectInfos = defectInfoRepository.findByDefectId(defect.getDefectId());
                    if (!defectInfos.isEmpty()) {
                        for (DefectInfo info : defectInfos) {
                            List<DefectImage> images = defectImageRepository.findByInfoId(info.getInfoId());
                            if (!images.isEmpty()) {
                                document.add(new Paragraph("Defect Images:"));
                                for (DefectImage image : images) {
                                    try {
                                        if (image.getImagePath() != null && !image.getImagePath().isEmpty()) {
                                            com.lowagie.text.Image img = com.lowagie.text.Image.getInstance(image.getImagePath());
                                            img.scalePercent(80);
                                            document.add(img);
                                        }
                                    } catch (Exception e) {
                                        document.add(new Paragraph("Image not found: " + image.getImagePath()));
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // External Services
            List<ExternalServices> services = externalServicesRepository.findBySiteId(siteId);
            if (!services.isEmpty()) {
                document.add(new Paragraph("\nEXTERNAL SERVICES"));
                document.add(createExternalServicesTable(services));
            }

            // Specifications - Get buildings and then get specifications for each
            List<Specification> allSpecs = new ArrayList<>();
            for (MainBuilding building : mainBuildings) {
                allSpecs.addAll(specificationRepository.findByBuildingId(building.getBuildingId()));
            }
            for (AncillaryBuilding building : ancillaryBuildings) {
                allSpecs.addAll(specificationRepository.findByBuildingId(building.getStructureId()));
            }
            if (!allSpecs.isEmpty()) {
                document.add(new Paragraph("\nSPECIFICATIONS"));
                document.add(createSpecificationsTable(allSpecs));
            }

            // Footer
            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Generated on: " + formatter.format(Instant.now()));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

        } finally {
            document.close();
            fos.close();
        }

        return filePath;
    }

    private PdfPTable createMetadataTable(Site site, UUID analysisId) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Report ID");
        addTableCell(table, analysisId.toString());
        addTableCell(table, "Site ID");
        addTableCell(table, site.getSiteId().toString());
        addTableCell(table, "Generated Date");
        addTableCell(table, formatter.format(Instant.now()));

        return table;
    }

    private PdfPTable createSiteInfoTable(Site site) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Owner Name");
        addTableCell(table, site.getOwnerName() != null ? site.getOwnerName() : "N/A");
        addTableCell(table, "Owner Contact");
        addTableCell(table, site.getOwnerContact() != null ? site.getOwnerContact() : "N/A");
        addTableCell(table, "Address");
        addTableCell(table, site.getAddress() != null ? site.getAddress() : "N/A");
        addTableCell(table, "Latitude");
        addTableCell(table, site.getLatitude() != null ? site.getLatitude().toString() : "N/A");
        addTableCell(table, "Longitude");
        addTableCell(table, site.getLongitude() != null ? site.getLongitude().toString() : "N/A");
        addTableCell(table, "Building Ref");
        addTableCell(table, site.getBuildingRef() != null ? site.getBuildingRef() : "N/A");
        addTableCell(table, "Sync Status");
        addTableCell(table, site.getSyncStatus() != null ? site.getSyncStatus() : "N/A");

        return table;
    }

    private PdfPTable createMainBuildingTable(MainBuilding building) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Building ID");
        addTableCell(table, building.getBuildingId().toString());
        addTableCell(table, "Number of Floors");
        addTableCell(table, building.getNoFloors() != null ? building.getNoFloors() : "N/A");
        addTableCell(table, "Sync Status");
        addTableCell(table, building.getSyncStatus() != null ? building.getSyncStatus() : "N/A");

        return table;
    }

    private PdfPTable createAncillaryBuildingTable(AncillaryBuilding building) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Building ID");
        addTableCell(table, building.getBuildingId().toString());
        addTableCell(table, "Type");
        addTableCell(table, building.getType() != null ? building.getType() : "N/A");
        addTableCell(table, "Sync Status");
        addTableCell(table, building.getSyncStatus() != null ? building.getSyncStatus() : "N/A");

        return table;
    }

    private PdfPTable createObservationsTable(List<GeneralObservation> observations) {
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);

        addTableCell(table, "Type");
        addTableCell(table, "Present Condition");
        addTableCell(table, "Approx Age");

        for (GeneralObservation obs : observations) {
            addTableCell(table, obs.getType() != null ? obs.getType() : "N/A");
            addTableCell(table, obs.getPresentCondition() != null ? obs.getPresentCondition() : "N/A");
            addTableCell(table, obs.getApproxAge() != null ? obs.getApproxAge() : "N/A");
        }

        return table;
    }

    private PdfPTable createDefectTable(Defect defect) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Defect ID");
        addTableCell(table, defect.getDefectId().toString());
        addTableCell(table, "Sync Status");
        addTableCell(table, defect.getSyncStatus() != null ? defect.getSyncStatus() : "N/A");

        List<DefectInfo> defectInfos = defectInfoRepository.findByDefectId(defect.getDefectId());
        if (!defectInfos.isEmpty()) {
            addTableCell(table, "Details");
            StringBuilder details = new StringBuilder();
            for (DefectInfo info : defectInfos) {
                details.append(info.toString()).append("\n");
            }
            addTableCell(table, details.toString());
        }

        return table;
    }

    private PdfPTable createExternalServicesTable(List<ExternalServices> services) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Service Type");
        addTableCell(table, "Details");

        for (ExternalServices service : services) {
            addTableCell(table, "Water Supply");
            addTableCell(table, service.getPipeBornWaterSupply() != null ? service.getPipeBornWaterSupply() : "N/A");
            addTableCell(table, "Sewage/Waste");
            addTableCell(table, service.getSewageWaste() != null ? service.getSewageWaste() : "N/A");
            addTableCell(table, "Electricity");
            addTableCell(table, service.getElectricitySource() != null ? service.getElectricitySource() : "N/A");
        }

        return table;
    }

    private PdfPTable createSpecificationsTable(List<Specification> specs) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        addTableCell(table, "Specification Type");
        addTableCell(table, "Details");

        for (Specification spec : specs) {
            addTableCell(table, spec.getSpecType() != null ? spec.getSpecType() : "N/A");
            addTableCell(table, spec.getSpecDetails() != null ? spec.getSpecDetails() : "N/A");
        }

        return table;
    }

    /**
     * Helper method to add styled table cells
     */
    private void addTableCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Paragraph(text));
        cell.setPadding(5);
        table.addCell(cell);
    }

    /**
     * Get analysis by ID
     */
    public Optional<Analysis> getAnalysisById(UUID analysisId) {
        return analysisRepository.findById(analysisId);
    }

    /**
     * Get all analyses for a site
     */
    public List<Analysis> getAnalysesBySite(UUID siteId) {
        return analysisRepository.findBySiteId(siteId);
    }

    /**
     * Get all analyses for a user
     */
    public List<Analysis> getAnalysesByUser(UUID userId) {
        return analysisRepository.findByUserId(userId);
    }
}
