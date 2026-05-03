# PDF Report Generation API

## Overview
This API allows you to generate comprehensive PDF reports from building inspection data. Each report is created as an "Analysis Order" with a unique UUID and contains all relevant data from the database for a specific site.

## Features
- **Create Analysis Order**: Submit a request to generate a PDF report for a site
- **Download Report**: Retrieve generated PDF files
- **Track Reports**: View all analysis orders for a site or user
- **Automatic PDF Generation**: PDFs are created with organized sections for all entity data

## Database Schema
A new `Analysis` entity has been created to track all report generation requests:

```sql
CREATE TABLE analysis (
  analysis_id UUID PRIMARY KEY,
  site_id UUID NOT NULL,
  user_id UUID NOT NULL,
  report_title VARCHAR(255),
  status VARCHAR(50),
  pdf_path VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Endpoints

### 1. Generate PDF Report
**POST** `/api/reports/generate`

Creates a new analysis order and generates a PDF report.

**Request Body:**
```json
{
  "siteId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "reportTitle": "Building Inspection Report - Site A",
  "notes": "Initial inspection report"
}
```

**Response (201 Created):**
```json
{
  "analysisId": "550e8400-e29b-41d4-a716-446655440002",
  "siteId": "550e8400-e29b-41d4-a716-446655440000",
  "reportTitle": "Building Inspection Report - Site A",
  "status": "GENERATED",
  "pdfPath": "uploads/reports/Report_550e8400-e29b-41d4-a716-446655440002_1714680000000.pdf",
  "createdAt": "2024-05-02T10:00:00Z",
  "message": "Report generated successfully"
}
```

**Status Codes:**
- `201 Created` - Report generated successfully
- `400 Bad Request` - Missing required fields (siteId or userId)
- `500 Internal Server Error` - PDF generation failed

---

### 2. Download Generated PDF
**GET** `/api/reports/{analysisId}/download`

Downloads the PDF file for a specific analysis order.

**Path Parameters:**
- `analysisId` (UUID): The unique identifier of the analysis order

**Response:**
- `200 OK` - Returns the PDF file as binary data
- `404 Not Found` - Analysis or PDF file not found
- `500 Internal Server Error` - File retrieval failed

**Example:**
```bash
GET /api/reports/550e8400-e29b-41d4-a716-446655440002/download
```

---

### 3. Get Analysis Details
**GET** `/api/reports/{analysisId}`

Retrieves details of a specific analysis order (without downloading the PDF).

**Path Parameters:**
- `analysisId` (UUID): The unique identifier of the analysis order

**Response (200 OK):**
```json
{
  "analysisId": "550e8400-e29b-41d4-a716-446655440002",
  "siteId": "550e8400-e29b-41d4-a716-446655440000",
  "reportTitle": "Building Inspection Report - Site A",
  "status": "GENERATED",
  "pdfPath": "uploads/reports/Report_550e8400-e29b-41d4-a716-446655440002_1714680000000.pdf",
  "createdAt": "2024-05-02T10:00:00Z",
  "message": "Analysis report"
}
```

---

### 4. Get All Reports for a Site
**GET** `/api/reports/site/{siteId}`

Retrieves all analysis orders and reports generated for a specific site.

**Path Parameters:**
- `siteId` (UUID): The site identifier

**Response (200 OK):**
```json
[
  {
    "analysisId": "550e8400-e29b-41d4-a716-446655440002",
    "siteId": "550e8400-e29b-41d4-a716-446655440000",
    "reportTitle": "Building Inspection Report - Site A",
    "status": "GENERATED",
    "pdfPath": "uploads/reports/Report_550e8400-e29b-41d4-a716-446655440002_1714680000000.pdf",
    "createdAt": "2024-05-02T10:00:00Z",
    "message": "Analysis report"
  }
]
```

---

### 5. Get All Reports for a User
**GET** `/api/reports/user/{userId}`

Retrieves all analysis orders and reports created by a specific user.

**Path Parameters:**
- `userId` (UUID): The user identifier

**Response (200 OK):**
```json
[
  {
    "analysisId": "550e8400-e29b-41d4-a716-446655440002",
    "siteId": "550e8400-e29b-41d4-a716-446655440000",
    "reportTitle": "Building Inspection Report - Site A",
    "status": "GENERATED",
    "pdfPath": "uploads/reports/Report_550e8400-e29b-41d4-a716-446655440002_1714680000000.pdf",
    "createdAt": "2024-05-02T10:00:00Z",
    "message": "Analysis report"
  },
  {
    "analysisId": "550e8400-e29b-41d4-a716-446655440003",
    "siteId": "550e8400-e29b-41d4-a716-446655440001",
    "reportTitle": "Building Inspection Report - Site B",
    "status": "GENERATED",
    "pdfPath": "uploads/reports/Report_550e8400-e29b-41d4-a716-446655440003_1714680100000.pdf",
    "createdAt": "2024-05-02T10:01:40Z",
    "message": "Analysis report"
  }
]
```

---

## PDF Report Contents

Each generated PDF report includes the following sections (when data is available):

1. **Report Title** - Customizable title provided in the request
2. **Metadata** - Report ID, Site ID, and Generation Date
3. **Site Information** - Owner details, address, GPS coordinates, building references
4. **Main Building** - Floor count and building status
5. **Ancillary Buildings** - Details of secondary structures
6. **General Observations** - Building condition, age, and observations
7. **Defects** - Identified defects with measurements and details
8. **Defect Images** - Associated images for each defect (if available)
9. **External Services** - Water supply, sewage, electricity information
10. **Specifications** - Building element specifications and properties
11. **Footer** - PDF generation timestamp

---

## Usage Examples

### cURL Example

Generate a report:
```bash
curl -X POST http://localhost:8080/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "siteId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "reportTitle": "Q2 Building Inspection Report",
    "notes": "Comprehensive inspection for compliance review"
  }'
```

Download the report:
```bash
curl -X GET http://localhost:8080/api/reports/550e8400-e29b-41d4-a716-446655440002/download \
  -o building_report.pdf
```

---

## Dependencies Added

The following Maven dependencies have been added to support PDF generation:

```xml
<!-- PDF Generation with iText7 -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itext7-core</artifactId>
    <version>7.3.0</version>
    <type>pom</type>
</dependency>
```

---

## File Structure

Generated PDFs are stored in:
```
uploads/reports/Report_{analysisId}_{timestamp}.pdf
```

Example: `uploads/reports/Report_550e8400-e29b-41d4-a716-446655440002_1714680000000.pdf`

---

## Error Handling

### Common Errors

**Missing Required Fields:**
```json
{
  "status": "ERROR",
  "message": "siteId and userId are required"
}
```

**Site Not Found:**
```json
{
  "status": "ERROR",
  "message": "Failed to generate report: Site not found: {siteId}"
}
```

**PDF Generation Failure:**
```json
{
  "status": "ERROR",
  "message": "Failed to generate report: {error_details}"
}
```

---

## Configuration

### Directory Setup
The `uploads/reports/` directory is automatically created when the application starts if it doesn't exist.

### Date Format
All timestamps in reports are formatted as: `yyyy-MM-dd HH:mm:ss`

---

## Future Enhancements

- Email delivery of generated reports
- Report templates customization
- Batch report generation
- Report archiving and retention policies
- Digital signatures for compliance
- Multi-language support

---

## Support

For issues or questions about the PDF Report Generation API, please contact the development team.
