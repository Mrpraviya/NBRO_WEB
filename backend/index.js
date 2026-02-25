const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// PDF generation
const PDFDocument = require("pdfkit");
const LOGO_PATH = path.join(__dirname, "..", "public", "images", "logo.png");

// multer for file uploads
const multer = require("multer");
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const safeName =
      Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, safeName);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

// Simple API key middleware: if API_KEY is set, require x-api-key header to match
function requireApiKey(req, res, next) {
  const required = process.env.API_KEY;
  if (!required) return next();
  const key = req.header("x-api-key");
  if (!key || key !== required)
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  return next();
}

// delete uploaded file
app.delete("/api/uploads/:filename", requireApiKey, (req, res) => {
  try {
    const filename = req.params.filename;
    const target = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(target))
      return res.status(404).json({ ok: false, error: "File not found" });
    fs.unlinkSync(target);

    // Optionally remove references from a report if reportId query param provided
    const reportId = req.query.reportId ? Number(req.query.reportId) : null;
    if (reportId) {
      try {
        const db = readDB();
        const rptIdx = (db.reports || []).findIndex((r) => r.id === reportId);
        if (rptIdx !== -1) {
          const report = db.reports[rptIdx];
          if (Array.isArray(report.attachments)) {
            report.attachments = report.attachments.filter((a) => {
              if (!a || !a.url) return true;
              const parts = a.url.split("/uploads/");
              const fn = parts.length > 1 ? parts[1] : null;
              return fn !== filename;
            });
            db.reports[rptIdx] = report;
            writeDB(db);
          }
        }
      } catch (e) {
        console.warn("Failed to update report after deleting attachment", e);
      }
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("Failed to delete file", e);
    return res.status(500).json({ ok: false, error: "Failed to delete file" });
  }
});

// Delete a report and its attached files
app.delete("/api/reports/:id", requireApiKey, (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = readDB();
    const idx = (db.reports || []).findIndex((r) => r.id === id);
    if (idx === -1)
      return res.status(404).json({ ok: false, error: "Report not found" });
    const report = db.reports[idx];
    // remove attachments files
    if (Array.isArray(report.attachments)) {
      report.attachments.forEach((a) => {
        try {
          if (a && a.url) {
            const parts = a.url.split("/uploads/");
            const filename = parts.length > 1 ? parts[1] : null;
            if (filename) {
              const target = path.join(UPLOADS_DIR, filename);
              if (fs.existsSync(target)) fs.unlinkSync(target);
            }
          }
        } catch (e) {
          console.warn("Failed to delete attachment file", e);
        }
      });
    }
    // remove report
    db.reports.splice(idx, 1);
    writeDB(db);
    return res.json({ ok: true });
  } catch (e) {
    console.error("Failed to delete report", e);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to delete report" });
  }
});

// Update a report (partial update)
app.put("/api/reports/:id", requireApiKey, (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = readDB();
    const idx = (db.reports || []).findIndex((r) => r.id === id);
    if (idx === -1)
      return res.status(404).json({ ok: false, error: "Report not found" });
    const existing = db.reports[idx];
    const updated = { ...existing, ...req.body };
    db.reports[idx] = updated;
    writeDB(db);
    return res.json({ ok: true, report: updated });
  } catch (e) {
    console.error("Failed to update report", e);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to update report" });
  }
});

// single file upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res
      .status(201)
      .json({
        ok: true,
        file: {
          name: req.file.originalname,
          url,
          type: req.file.mimetype,
          size: req.file.size,
        },
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Upload failed" });
  }
});

const DB_FILE = path.join(__dirname, "db.json");

function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { reports: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/reports", (req, res) => {
  const db = readDB();
  res.json(db.reports || []);
});

app.post("/api/reports", (req, res) => {
  try {
    const report = req.body;
    report.id = Date.now();
    report.createdAt = new Date().toISOString();
    const db = readDB();
    db.reports = db.reports || [];
    db.reports.push(report);
    writeDB(db);
    return res.status(201).json({ ok: true, id: report.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Failed to save report" });
  }
});

// Export selected reports as a single PDF (POST body: { ids: [id1,id2,...] })
app.post("/api/export/pdf", requireApiKey, (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids)
      ? req.body.ids
      : req.body.id
        ? [req.body.id]
        : [];
    const db = readDB();
    const reports = (db.reports || []).filter((r) => ids.includes(r.id));
    if (!reports || reports.length === 0)
      return res.status(404).json({ ok: false, error: "No reports found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="reports.pdf"');

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Header on each page - full-width logo
    let pageCount = 0;
    const drawHeader = () => {
      try {
        if (fs.existsSync(LOGO_PATH)) {
          const pageWidth = doc.page.width; // full page width in points
          // draw at x=0 to span across page width
          doc.image(LOGO_PATH, 0, 0, { width: pageWidth });
          doc.moveDown(6);
        }
      } catch (e) {
        console.warn("Logo not added to PDF header", e);
      }
    };

    doc.on("error", (err) => {
      console.error("PDFDocument stream error", err);
      if (!res.headersSent) {
        res.status(500).json({ ok: false, error: "PDF generation failed" });
      } else {
        res.end();
      }
    });
    doc.pipe(res);

    doc.on("pageAdded", () => {
      pageCount++;
      drawHeader();
      // footer placeholder
        // const bottom = doc.page.height - 40;
        // doc.fontSize(9).fillColor('gray').text(`Page ${pageCount}`, 50, bottom, { align: 'right', width: doc.page.width - 100 });
    });

    // First page header
    drawHeader();

    reports.forEach((report, idx) => {
      if (idx > 0) doc.addPage();
      pageCount++;

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(`Report ID: ${report.id}`, { continued: false });
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Applicant: ${report.applicantName || ""}`);
      doc.text(`Inspection Date: ${report.inspectionDate || ""}`);
      doc.text(`District: ${report.district || ""}`);
      doc.text(`GN Division: ${report.gnDivision || ""}`);
      doc.text(`Risk Level: ${report.riskLevel || ""}`);
      doc.moveDown(0.5);
      doc.fontSize(12).text("Observations:", { underline: true });
      doc.fontSize(10).text(report.observations || "", { align: "left" });
      doc.moveDown(0.5);
      doc.fontSize(12).text("Recommendation:", { underline: true });
      doc.fontSize(10).text(report.recommendation || "", { align: "left" });
      doc.moveDown(0.7);

      // Attach images if present
      if (Array.isArray(report.attachments) && report.attachments.length > 0) {
        doc.fontSize(12).text("Attachments:", { underline: true });
        report.attachments.forEach((a) => {
          try {
            if (!a || !a.url) return;
            // if image, embed; else show filename and url
            if (a.type && a.type.startsWith("image/")) {
              // extract filename from url
              const parts = a.url.split("/uploads/");
              const filename = parts.length > 1 ? parts[1] : null;
              if (filename) {
                const filePath = path.join(UPLOADS_DIR, filename);
                if (fs.existsSync(filePath)) {
                  doc.moveDown(0.2);
                  // fit into page width
                  doc.image(filePath, { fit: [450, 300], align: "center" });
                  doc.moveDown(0.2);
                }
              }
            } else {
              doc
                .fontSize(10)
                .fillColor("blue")
                .text(a.name || a.url || "Attachment", { link: a.url });
              doc.fillColor("black");
            }
          } catch (e) {
            console.warn("Failed to add attachment to PDF", e);
          }
        });
      }
      // footer for this page
      const bottom = doc.page.height - 40;
      doc
        .fontSize(9)
        .fillColor("gray")
        .text(
          `Report ID: ${report.id} • Generated: ${new Date().toLocaleString()}`,
          50,
          bottom,
          { align: "left", width: doc.page.width - 100 },
        );
      doc
        .fontSize(9)
        .fillColor("gray")
        .text(`Page ${pageCount}`, 50, bottom, {
          align: "right",
          width: doc.page.width - 100,
        });
    });

    doc.end();
  } catch (e) {
    console.error("Failed to generate PDF", e);
    return res.status(500).json({ ok: false, error: "Failed to generate PDF" });
  }
});

// Attempt to start HTTPS server if certs are available, otherwise fall back to HTTP
const certDir = path.join(__dirname, "certs");
const certFile = path.join(certDir, "localhost.pem");
const keyFile = path.join(certDir, "localhost-key.pem");

function tryListen(server, port) {
  return new Promise((resolve, reject) => {
    let done = false;
    server.once("error", (err) => {
      if (done) return;
      done = true;
      reject(err);
    });
    server.once("listening", () => {
      if (done) return;
      done = true;
      resolve();
    });
    server.listen(port);
  });
}

async function startWithFallback(startPort, maxAttempts = 10) {
  let port = Number(startPort) || 4000;
  const useHttps = fs.existsSync(certFile) && fs.existsSync(keyFile);
  const https = useHttps ? require("https") : null;
  const cert = useHttps ? fs.readFileSync(certFile) : null;
  const key = useHttps ? fs.readFileSync(keyFile) : null;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      if (useHttps) {
        const server = https.createServer({ key, cert }, app);
        await tryListen(server, port);
        console.log(
          `Mock backend running at https://localhost:${port} (HTTPS)`,
        );
        return;
      } else {
        const http = require("http");
        const server = http.createServer(app);
        await tryListen(server, port);
        console.log(`Mock backend running at http://localhost:${port}`);
        return;
      }
    } catch (err) {
      if (err && err.code === "EADDRINUSE") {
        console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
        port = port + 1;
        continue;
      }
      console.error("Server failed to start:", err);
      process.exit(1);
    }
  }

  console.error(
    `Failed to bind a server after ${maxAttempts} attempts starting at port ${startPort}`,
  );
  process.exit(1);
}

startWithFallback(PORT, 10);
