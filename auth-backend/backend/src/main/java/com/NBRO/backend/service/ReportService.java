package com.NBRO.backend.service;

import com.NBRO.backend.dto.ReportRequest;
import com.NBRO.backend.entity.*;
import com.NBRO.backend.repository.*;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
public class ReportService {

    private static final String REPORTS_DIRECTORY = "uploads/reports/";
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

    @Autowired
    private DetailTypeRepository detailTypeRepository;

    @Autowired
    private BuildingDetailRepository buildingDetailRepository;

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
    public Analysis createAnalysisOrder(@NonNull ReportRequest request) throws IOException {
        UUID siteId = requireUuid(request.getSiteId(), "siteId");
        UUID userId = requireUuid(request.getUserId(), "userId");
        String reportTitle = request.getReportTitle();
        if (reportTitle == null) {
            reportTitle = "Analysis Report - " + siteId;
        }

        // Create Analysis record
        Analysis analysis = new Analysis();
        analysis.setSiteId(siteId);
        analysis.setUserId(userId);
        analysis.setReportTitle(reportTitle);
        analysis.setNotes(request.getNotes());
        analysis.setStatus("PENDING");

        // Persist before using the generated ID in the PDF filename.
        analysis = analysisRepository.saveAndFlush(analysis);
        UUID analysisId = requireUuid(analysis.getAnalysisId(), "analysisId");

        // Generate PDF
        String pdfPath = generatePDF(siteId, analysisId, reportTitle);
        
        analysis.setPdfPath(pdfPath);
        analysis.setStatus("GENERATED");

        // Save and return
        return analysisRepository.save(analysis);
    }

    /**
     * Generate PDF report from site data
     */
    private String generatePDF(@NonNull UUID siteId, @NonNull UUID analysisId, @NonNull String reportTitle) throws IOException {
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new IllegalArgumentException("Site not found: " + siteId));
        List<MainBuilding> mainBuildings = mainBuildingRepository.findBySiteId(siteId);
        List<AncillaryBuilding> ancillaryBuildings = ancillaryBuildingRepository.findBySiteId(siteId);
        List<GeneralObservation> observations = generalObservationRepository.findBySiteId(siteId);
        List<ExternalServices> services = externalServicesRepository.findBySiteId(siteId);
        List<Defect> defects = defectRepository.findBySiteId(siteId);
        List<Specification> specifications = new ArrayList<>();
        for (MainBuilding building : mainBuildings) {
            specifications.addAll(specificationRepository.findByBuildingId(building.getBuildingId()));
        }
        for (AncillaryBuilding building : ancillaryBuildings) {
            specifications.addAll(specificationRepository.findByBuildingId(building.getStructureId()));
        }

        String fileName = "Report_" + analysisId + "_" + System.currentTimeMillis() + ".pdf";
        String filePath = REPORTS_DIRECTORY + fileName;

        byte[] logoBytes;
        try (InputStream logoStream = new ClassPathResource("report-logo.png").getInputStream()) {
            logoBytes = logoStream.readAllBytes();
        }

        Document document = new Document(PageSize.A4, 42, 42, 68, 48);
        try (FileOutputStream output = new FileOutputStream(filePath)) {
            PdfWriter writer = PdfWriter.getInstance(document, output);
            writer.setPageEvent(new BrandedPageEvent(logoBytes));
            document.open();
            try {
                addDefectNotationAnnex(document);
                document.newPage();
                addSurveyCover(document, site, analysisId, reportTitle);
                document.newPage();
                addSiteDataSheet(document, site, observations, services, ancillaryBuildings);
                document.newPage();
                addBuildingElementsPage(document, mainBuildings, specifications);
                document.newPage();
                addDefectsPage(document, defects);
            } finally {
                document.close();
            }
        }

        return filePath;
    }

    private void addDefectNotationAnnex(Document document) throws DocumentException {
        Paragraph heading = new Paragraph("NATIONAL BUILDING RESEARCH ORGANISATION", reportFont(15, Font.BOLD, INK));
        heading.setAlignment(Element.ALIGN_CENTER);
        heading.setSpacingAfter(3);
        document.add(heading);
        Paragraph division = new Paragraph("STRUCTURAL ENGINEERING RESEARCH & PROJECT MANAGEMENT DIVISION", reportFont(9, Font.BOLD, INK));
        division.setAlignment(Element.ALIGN_CENTER);
        document.add(division);
        Paragraph annexTitle = new Paragraph("ANNEX - I | DEFECT NOTATION REFERENCE", reportFont(11, Font.BOLD, BRAND_RED));
        annexTitle.setAlignment(Element.ALIGN_CENTER);
        annexTitle.setSpacingBefore(5);
        annexTitle.setSpacingAfter(12);
        document.add(annexTitle);

        PdfPTable table = new PdfPTable(new float[]{1.7f, 1.25f, 1.1f, 2.4f, 2.1f});
        table.setWidthPercentage(100);
        addHeaderCells(table, "Photo table type", "Defect type", "Notation", "Description", "Remarks");
        addLegendRow(table, "Type 01 - Building floor", "Cracks", "C, BC, CC, FC, SC, TC", "Wall, beam, column, floor, slab or tile crack", "Use the appropriate element notation.");
        addLegendRow(table, "", "Separations", "SP", "Separation", "Specify wall-wall, beam-wall, column-wall, floor-wall or slab-beam in remarks.");
        addLegendRow(table, "", "Damages", "D, WD, BD, CD, FD, SD, TD, GD, PD, RD", "Damaged area; wall, beam, column, floor, slab, tile, glass, plaster or roof damage", "Sun shed, ceiling and door/window frame damage may be noted under D.");
        addLegendRow(table, "", "Patches", "DP", "Damp patch", "Specify whether on wall, slab, beam or column.");
        addLegendRow(table, "Type 02 - Boundary wall", "Cracks", "BWC", "Boundary wall crack", "");
        addLegendRow(table, "", "Separations", "BWSP", "Boundary wall separation", "");
        addLegendRow(table, "", "Damages", "BWD", "Boundary wall damage", "");
        addLegendRow(table, "", "Patches", "BWDP", "Damp patch on boundary wall", "");
        document.add(table);
    }

    private void addSurveyCover(Document document, Site site, UUID analysisId, String reportTitle) throws DocumentException {
        addCentered(document, safe(reportTitle).toUpperCase(Locale.ROOT), 17, Font.BOLD, INK, 3);
        addCentered(document, "PRE-CRACK SURVEY REPORT ON BUILDINGS AROUND PREMISES", 12, Font.BOLD, INK, 3);
        addCentered(document, safe(site.getAddress()), 11, Font.BOLD, INK, 3);
        addCentered(document, "FOR NATIONAL BUILDING RESEARCH ORGANISATION", 10, Font.BOLD, INK, 14);

        PdfPTable identity = new PdfPTable(new float[]{1.6f, 3.4f});
        identity.setWidthPercentage(100);
        identity.setSpacingAfter(12);
        addKeyValue(identity, "Building Reference No.", site.getBuildingRef());
        addKeyValue(identity, "Name of Owner", site.getOwnerName());
        addKeyValue(identity, "Report ID", analysisId);
        document.add(identity);

        PdfPTable photoFrame = new PdfPTable(1);
        photoFrame.setWidthPercentage(100);
        PdfPCell photoCell = new PdfPCell();
        photoCell.setFixedHeight(385);
        photoCell.setPadding(12);
        photoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        Image buildingPhoto = loadReportImage(firstValue(site.getBuildingPhotoPath(), site.getBuildingPhotoUrl()));
        if (buildingPhoto != null) {
            buildingPhoto.scaleToFit(485, 335);
            buildingPhoto.setAlignment(Element.ALIGN_CENTER);
            photoCell.addElement(buildingPhoto);
        } else {
            Paragraph placeholder = new Paragraph("[ Front View Building Photo Placeholder ]", reportFont(11, Font.ITALIC, MUTED));
            placeholder.setAlignment(Element.ALIGN_CENTER);
            photoCell.addElement(placeholder);
        }
        photoCell.setBorderColor(GRID);
        photoFrame.addCell(photoCell);
        document.add(photoFrame);

        Paragraph caption = new Paragraph("Front view of the building                                      Situation as at " +
                DateTimeFormatter.ofPattern("dd.MM.yyyy").withZone(ZoneId.systemDefault()).format(Instant.now()),
                reportFont(9, Font.BOLD, INK));
        caption.setSpacingBefore(5);
        document.add(caption);
    }

    private void addSiteDataSheet(Document document, Site site, List<GeneralObservation> observations,
                                  List<ExternalServices> services, List<AncillaryBuilding> ancillaryBuildings)
            throws DocumentException {
        addCentered(document, "PRE-CRACK SURVEY REPORT ON BUILDINGS AROUND PREMISES", 12, Font.BOLD, INK, 2);
        addCentered(document, "SITE DATA SHEET", 13, Font.BOLD, BRAND_RED, 10);

        PdfPTable siteData = new PdfPTable(new float[]{1.6f, 2.8f, 1.6f, 2.2f});
        siteData.setWidthPercentage(100);
        addKeyValue(siteData, "Name of Owner", site.getOwnerName());
        addKeyValue(siteData, "Building Ref. No.", site.getBuildingRef());
        addKeyValue(siteData, "Address of Premises", site.getAddress());
        addKeyValue(siteData, "Contact No.", site.getOwnerContact());
        addKeyValue(siteData, "GPS Coordinates", "N: " + safe(site.getLatitude()) + "\nE: " + safe(site.getLongitude()));
        addKeyValue(siteData, "Distance from Row", site.getDistanceFromRow() == null ? "" : site.getDistanceFromRow() + " m");
        document.add(siteData);

        addSectionTitle(document, "1. General Observations");
        PdfPTable observationTable = new PdfPTable(new float[]{0.55f, 2.2f, 3.6f, 1.1f});
        observationTable.setWidthPercentage(100);
        addHeaderCells(observationTable, "No.", "Type", "Present Condition", "Approx. Age");
        if (observations.isEmpty()) {
            addEmptyRow(observationTable, 4, "No general observation records are available.");
        } else {
            int number = 1;
            for (GeneralObservation observation : observations) {
                addBodyCell(observationTable, String.valueOf(number++));
                addBodyCell(observationTable, observation.getType());
                addBodyCell(observationTable, observation.getPresentCondition());
                addBodyCell(observationTable, observation.getApproxAge());
            }
        }
        document.add(observationTable);

        addSectionTitle(document, "2. External Services");
        PdfPTable servicesTable = new PdfPTable(new float[]{1.6f, 2.2f, 2.2f, 2.2f});
        servicesTable.setWidthPercentage(100);
        addHeaderCells(servicesTable, "No.", "Pipe-borne Water Supply", "Sewage / Waste Water", "Electricity");
        if (services.isEmpty()) {
            addEmptyRow(servicesTable, 4, "No external service records are available.");
        } else {
            int number = 1;
            for (ExternalServices service : services) {
                addBodyCell(servicesTable, String.valueOf(number++));
                addBodyCell(servicesTable, service.getPipeBornWaterSupply());
                addBodyCell(servicesTable, service.getSewageWaste());
                addBodyCell(servicesTable, service.getElectricitySource());
            }
        }
        document.add(servicesTable);

        addSectionTitle(document, "3. Details of Ancillary Buildings / Structures");
        PdfPTable ancillaryTable = new PdfPTable(new float[]{0.6f, 3.0f, 1.35f, 1.35f, 1.35f, 1.35f});
        ancillaryTable.setWidthPercentage(100);
        addHeaderCells(ancillaryTable, "No.", "Details", "Front", "Left", "Right", "Rear");
        if (ancillaryBuildings.isEmpty()) {
            addEmptyRow(ancillaryTable, 6, "No ancillary building records are available.");
        } else {
            int number = 1;
            for (AncillaryBuilding building : ancillaryBuildings) {
                List<DetailType> detailTypes = detailTypeRepository.findByStructureId(building.getStructureId());
                if (detailTypes.isEmpty()) {
                    addBodyCell(ancillaryTable, String.valueOf(number++));
                    addBodyCell(ancillaryTable, building.getBuildingType());
                    addBodyCell(ancillaryTable, "-");
                    addBodyCell(ancillaryTable, "-");
                    addBodyCell(ancillaryTable, "-");
                    addBodyCell(ancillaryTable, "-");
                    continue;
                }
                for (DetailType detailType : detailTypes) {
                    List<BuildingDetail> sides = buildingDetailRepository.findByDetailTypeId(detailType.getDetailTypeId());
                    if (sides.isEmpty()) {
                        addBodyCell(ancillaryTable, String.valueOf(number++));
                        addBodyCell(ancillaryTable, firstValue(detailType.getName(), building.getBuildingType()));
                        addBodyCell(ancillaryTable, "-");
                        addBodyCell(ancillaryTable, "-");
                        addBodyCell(ancillaryTable, "-");
                        addBodyCell(ancillaryTable, "-");
                        continue;
                    }
                    for (BuildingDetail detail : sides) {
                        addBodyCell(ancillaryTable, String.valueOf(number++));
                        addBodyCell(ancillaryTable, firstValue(detailType.getName(), building.getBuildingType()));
                        addBodyCell(ancillaryTable, sideValue(detail.getFront()));
                        addBodyCell(ancillaryTable, sideValue(detail.getLeftSide()));
                        addBodyCell(ancillaryTable, sideValue(detail.getRightSide()));
                        addBodyCell(ancillaryTable, sideValue(detail.getRear()));
                    }
                }
            }
        }
        document.add(ancillaryTable);
    }

    private void addBuildingElementsPage(Document document, List<MainBuilding> mainBuildings,
                                        List<Specification> specifications) throws DocumentException {
        addSectionTitle(document, "4. Details of Main Building Elements");
        PdfPTable buildingsTable = new PdfPTable(new float[]{0.7f, 2.5f, 2.2f, 2.0f});
        buildingsTable.setWidthPercentage(100);
        addHeaderCells(buildingsTable, "No.", "Building ID", "Number of Floors", "Sync Status");
        if (mainBuildings.isEmpty()) {
            addEmptyRow(buildingsTable, 4, "No main building records are available.");
        } else {
            int number = 1;
            for (MainBuilding building : mainBuildings) {
                addBodyCell(buildingsTable, String.valueOf(number++));
                addBodyCell(buildingsTable, building.getBuildingId());
                addBodyCell(buildingsTable, building.getNoFloors());
                addBodyCell(buildingsTable, building.getSyncStatus());
            }
        }
        document.add(buildingsTable);

        addSectionTitle(document, "Main Building Specifications");
        PdfPTable specificationTable = new PdfPTable(new float[]{1.9f, 1.0f, 3.0f, 3.1f});
        specificationTable.setWidthPercentage(100);
        addHeaderCells(specificationTable, "Element", "In Use", "Element Properties", "Floor Details");
        if (specifications.isEmpty()) {
            addEmptyRow(specificationTable, 4, "No building specification records are available.");
        } else {
            for (Specification specification : specifications) {
                addBodyCell(specificationTable, specification.getElementType());
                addBodyCell(specificationTable, specification.getIsUsed() == null ? "" : specification.getIsUsed() ? "Yes" : "No");
                addBodyCell(specificationTable, specification.getElementProperties());
                addBodyCell(specificationTable, specification.getFloorDetails());
            }
        }
        document.add(specificationTable);
    }

    private void addDefectsPage(Document document, List<Defect> defects) throws DocumentException {
        addSectionTitle(document, "5. Details / Photographs of Defects");
        Paragraph note = new Paragraph("Defect records for the selected premises", reportFont(9, Font.NORMAL, MUTED));
        note.setSpacingAfter(8);
        document.add(note);

        PdfPTable defectTable = new PdfPTable(new float[]{1.0f, 0.8f, 0.8f, 1.9f, 2.6f});
        defectTable.setWidthPercentage(100);
        defectTable.setHeaderRows(1);
        addHeaderCells(defectTable, "Defect No.", "Length\n(mm)", "Width\n(mm)", "Photograph/s of Defect", "Description / Remarks");
        if (defects.isEmpty()) {
            addEmptyRow(defectTable, 5, "No defect records are available for this site.");
        } else {
            for (Defect defect : defects) {
                List<DefectInfo> information = defectInfoRepository.findByDefectId(defect.getDefectId());
                List<String> photoSources = new ArrayList<>();
                addIfPresent(photoSources, defect.getPhotoPath());
                addIfPresent(photoSources, defect.getPhotoUrl());
                StringBuilder remarks = new StringBuilder();
                String length = defect.getLengthMm() == null ? "" : defect.getLengthMm().toPlainString();
                String width = defect.getWidthMm() == null ? "" : defect.getWidthMm().toPlainString();
                appendText(remarks, defect.getDefectCategory());
                appendText(remarks, defect.getFloorLevel());
                appendText(remarks, defect.getLocationDescription());
                appendText(remarks, defect.getRemarks());

                for (DefectInfo info : information) {
                    appendText(remarks, info.getRemarks());
                    if (length.isBlank()) length = safeDimension(info.getLength());
                    if (width.isBlank()) width = safeDimension(info.getWidth());
                    for (DefectImage image : defectImageRepository.findByInfoId(info.getInfoId())) {
                        addIfPresent(photoSources, image.getImagePath());
                        addIfPresent(photoSources, image.getImageUrl());
                    }
                }

                addBodyCell(defectTable, defect.getNotation());
                addBodyCell(defectTable, length);
                addBodyCell(defectTable, width);
                defectTable.addCell(createPhotoCell(photoSources));
                addBodyCell(defectTable, remarks.toString());
            }
        }
        document.add(defectTable);
    }

    private PdfPCell createPhotoCell(List<String> sources) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(5);
        cell.setBorderColor(GRID);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        boolean addedPhoto = false;
        for (String source : sources) {
            Image image = loadReportImage(source);
            if (image != null) {
                image.scaleToFit(115, 110);
                image.setAlignment(Element.ALIGN_CENTER);
                cell.addElement(image);
                addedPhoto = true;
            }
        }
        if (!addedPhoto) {
            Paragraph placeholder = new Paragraph("[ Photo ]", reportFont(8, Font.ITALIC, MUTED));
            placeholder.setAlignment(Element.ALIGN_CENTER);
            cell.addElement(placeholder);
        }
        return cell;
    }

    private Image loadReportImage(String source) {
        if (source == null || source.isBlank()) return null;
        try {
            if (source.startsWith("https://") || source.startsWith("http://")) {
                return Image.getInstance(URI.create(source).toURL());
            }
            File imageFile = new File(source);
            return imageFile.isFile() ? Image.getInstance(imageFile.getAbsolutePath()) : null;
        } catch (Exception ignored) {
            return null;
        }
    }

    private void addCentered(Document document, String text, float size, int style, Color color, float spacingAfter)
            throws DocumentException {
        Paragraph paragraph = new Paragraph(safe(text), reportFont(size, style, color));
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.setSpacingAfter(spacingAfter);
        document.add(paragraph);
    }

    private void addSectionTitle(Document document, String title) throws DocumentException {
        Paragraph paragraph = new Paragraph(title, reportFont(11, Font.BOLD, INK));
        paragraph.setSpacingBefore(10);
        paragraph.setSpacingAfter(5);
        document.add(paragraph);
    }

    private void addHeaderCells(PdfPTable table, String... labels) {
        for (String label : labels) {
            PdfPCell cell = new PdfPCell(new Phrase(label, reportFont(8, Font.BOLD, Color.WHITE)));
            cell.setBackgroundColor(BRAND_RED);
            cell.setBorderColor(GRID);
            cell.setPadding(6);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(cell);
        }
    }

    private void addLegendRow(PdfPTable table, String type, String category, String notation, String description, String remarks) {
        addBodyCell(table, type);
        addBodyCell(table, category);
        addBodyCell(table, notation);
        addBodyCell(table, description);
        addBodyCell(table, remarks);
    }

    private void addKeyValue(PdfPTable table, String label, Object value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, reportFont(8, Font.BOLD, INK)));
        labelCell.setBackgroundColor(LIGHT_GRAY);
        labelCell.setBorderColor(GRID);
        labelCell.setPadding(6);
        table.addCell(labelCell);
        addBodyCell(table, value);
    }

    private void addBodyCell(PdfPTable table, Object value) {
        PdfPCell cell = new PdfPCell(new Phrase(safe(value), reportFont(8, Font.NORMAL, INK)));
        cell.setBorderColor(GRID);
        cell.setPadding(5);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }

    private void addEmptyRow(PdfPTable table, int columns, String message) {
        PdfPCell cell = new PdfPCell(new Phrase(message, reportFont(8, Font.ITALIC, MUTED)));
        cell.setColspan(columns);
        cell.setPadding(7);
        cell.setBorderColor(GRID);
        table.addCell(cell);
    }

    private Font reportFont(float size, int style, Color color) {
        return new Font(Font.HELVETICA, size, style, color);
    }

    private String safe(Object value) {
        if (value == null) return "—";
        String text = value.toString().trim();
        return text.isEmpty() ? "—" : text;
    }

    private String firstValue(String first, String second) {
        return first != null && !first.isBlank() ? first : second;
    }

    private String sideValue(Boolean present) {
        return Boolean.TRUE.equals(present) ? "Yes" : "-";
    }

    private void addIfPresent(List<String> values, String value) {
        if (value != null && !value.isBlank() && !values.contains(value)) values.add(value);
    }

    private void appendText(StringBuilder target, String value) {
        if (value == null || value.isBlank()) return;
        if (target.length() > 0) target.append("\n");
        target.append(value.trim());
    }

    private String safeDimension(String value) {
        return value == null ? "" : value.trim();
    }

    private static final Color BRAND_RED = new Color(139, 20, 30);
    private static final Color INK = new Color(35, 42, 52);
    private static final Color MUTED = new Color(100, 108, 118);
    private static final Color GRID = new Color(185, 190, 196);
    private static final Color LIGHT_GRAY = new Color(239, 241, 244);

    private static class BrandedPageEvent extends PdfPageEventHelper {
        private final byte[] logoBytes;

        private BrandedPageEvent(byte[] logoBytes) {
            this.logoBytes = logoBytes;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte canvas = writer.getDirectContent();
            float pageWidth = document.getPageSize().getWidth();
            try {
                Image logo = Image.getInstance(logoBytes);
                logo.scaleToFit(190, 25);
                logo.setAbsolutePosition(document.left(), document.getPageSize().getHeight() - 39);
                canvas.addImage(logo);
            } catch (Exception ignored) {
            }

            canvas.saveState();
            canvas.setColorStroke(BRAND_RED);
            canvas.setLineWidth(1.2f);
            canvas.moveTo(document.left(), document.getPageSize().getHeight() - 48);
            canvas.lineTo(document.right(), document.getPageSize().getHeight() - 48);
            canvas.stroke();
            canvas.setColorStroke(GRID);
            canvas.setLineWidth(0.6f);
            canvas.moveTo(document.left(), 38);
            canvas.lineTo(document.right(), 38);
            canvas.stroke();

            Font footerFont = new Font(Font.HELVETICA, 7, Font.BOLD, INK);
            ColumnText.showTextAligned(canvas, Element.ALIGN_LEFT,
                    new Phrase("STRUCTURAL ENGINEERING RESEARCH & PROJECT MANAGEMENT DIVISION - NBRO", footerFont),
                    document.left(), 25, 0);
            ColumnText.showTextAligned(canvas, Element.ALIGN_RIGHT,
                    new Phrase("SER & PMD  |  " + writer.getPageNumber(), footerFont),
                    pageWidth - document.rightMargin(), 25, 0);
            canvas.restoreState();
        }
    }

    /**
     * Get analysis by ID
     */
    public Optional<Analysis> getAnalysisById(@NonNull UUID analysisId) {
        return analysisRepository.findById(analysisId);
    }

    /**
     * Get all analyses for a site
     */
    public List<Analysis> getAnalysesBySite(@NonNull UUID siteId) {
        return analysisRepository.findBySiteId(siteId);
    }

    /**
     * Get all analyses for a user
     */
    public List<Analysis> getAnalysesByUser(@NonNull UUID userId) {
        return analysisRepository.findByUserId(userId);
    }

    @NonNull
    private UUID requireUuid(UUID value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
        return value;
    }
}
