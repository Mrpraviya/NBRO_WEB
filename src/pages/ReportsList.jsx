import { useEffect, useMemo, useState } from "react";

const backendBaseUrl =
  import.meta.env.VITE_SCHEMA_BACKEND_URL || "http://localhost:8080";

const TABLE_LABELS = {
  profile: "Profile",
  site: "Site",
  general_observation: "General Observation",
  external_services: "External Services",
  ancillary_building: "Ancillary Building",
  detail_type: "Detail Type",
  building_detail: "Building Detail",
  main_building: "Main Building",
  specification: "Specification",
  defects: "Defects",
  defect_info: "Defect Info",
  defect_image: "Defect Image",
};

const FALLBACK_TABLES = Object.keys(TABLE_LABELS).map((name) => ({
  name,
  rowCount: 0,
}));

export default function ReportsList() {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState("site");
  const [tableData, setTableData] = useState({ rows: [], columns: [] });
  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingRows, setLoadingRows] = useState(true);
  const [error, setError] = useState(null);

  const activeLabel = useMemo(
    () => TABLE_LABELS[activeTable] || activeTable,
    [activeTable],
  );

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (activeTable) {
      loadTableRows(activeTable);
    }
  }, [activeTable]);

  async function loadTables() {
    setLoadingTables(true);
    try {
      const res = await fetch(`${backendBaseUrl}/api/schema/tables`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const nextTables = Array.isArray(data) && data.length > 0 ? data : FALLBACK_TABLES;
      setTables(nextTables);
      setActiveTable((current) =>
        nextTables.some((table) => table.name === current)
          ? current
          : nextTables[0]?.name || "site",
      );
      setError(null);
    } catch (err) {
      console.error("Failed to load tables", err);
      setError(err.message || "Failed to load tables");
      setTables(FALLBACK_TABLES);
    } finally {
      setLoadingTables(false);
    }
  }

  async function loadTableRows(tableName) {
    setLoadingRows(true);
    try {
      const res = await fetch(`${backendBaseUrl}/api/schema/tables/${tableName}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setTableData({
        rows: Array.isArray(data.rows) ? data.rows : [],
        columns: Array.isArray(data.columns) ? data.columns : [],
      });
      setError(null);
    } catch (err) {
      console.error("Failed to load table data", err);
      setError(err.message || "Failed to load table data");
      setTableData({ rows: [], columns: [] });
    } finally {
      setLoadingRows(false);
    }
  }

  const columns = useMemo(() => {
    if (tableData.columns.length > 0) return tableData.columns;
    if (tableData.rows.length > 0) return Object.keys(tableData.rows[0]);
    return [];
  }, [tableData]);

  const exportPDF = () => {
    if (!tableData.rows.length || !columns.length) return;
    const blob = createPdfBlob(activeLabel, columns, tableData.rows);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTable}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div className="flex flex-col items-start gap-3">
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="secondary-btn cursor-pointer"
            >
              Dashboard
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              Database Tables
            </h2>
            <p className="text-sm text-gray-500">
              View every record from your inspection schema tables
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <button onClick={loadTables} className="secondary-btn cursor-pointer">
              Refresh Tables
            </button>
            <button onClick={exportPDF} className="primary-btn cursor-pointer">
              Download PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 text-sm font-semibold text-gray-700">
              Tables
            </div>
            {loadingTables ? (
              <div className="text-sm text-gray-500">Loading tables...</div>
            ) : (
              <div className="space-y-2">
                {tables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setActiveTable(table.name)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                      activeTable === table.name
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">
                      {TABLE_LABELS[table.name] || table.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number(table.rowCount ?? 0)} rows
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="border-b border-gray-200 p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {activeLabel}
                </h3>
                <p className="text-sm text-gray-500">
                  {tableData.rows.length} record{tableData.rows.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {loadingRows ? (
              <div className="p-6 text-sm text-gray-500">Loading rows...</div>
            ) : tableData.rows.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No data found for this table.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left">
                      {columns.map((column) => (
                        <th key={column} className="p-3 border-b font-semibold whitespace-nowrap">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                        {columns.map((column) => (
                          <td key={column} className="p-3 border-b align-top text-gray-700 max-w-xs">
                            <div className="wrap-break-word whitespace-pre-wrap">
                              {renderValue(row[column])}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function renderValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function createPdfBlob(title, columns, rows) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 40;
  const fontSize = 10;
  const lineHeight = 14;
  const maxCharsPerLine = 100;

  const lines = [];
  lines.push(title);
  lines.push("");
  lines.push(columns.join(" | "));
  lines.push("-".repeat(80));

  rows.forEach((row, index) => {
    const rowLine = columns.map((column) => renderValue(row[column])).join(" | ");
    const wrapped = wrapText(`${index + 1}. ${rowLine}`, maxCharsPerLine);
    lines.push(...wrapped, "");
  });

  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  const pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const catalogObject = addObject("");
  const pagesObject = addObject("");
  const fontObject = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageObjects = [];
  const contentObjects = [];

  pages.forEach((pageLines) => {
    const contentLines = [
      "BT",
      `/F1 ${fontSize} Tf`,
      `${margin} ${pageHeight - margin} Td`,
      `${lineHeight} TL`,
    ];

    pageLines.forEach((line, index) => {
      const escaped = escapePdfText(line);
      if (index === 0) {
        contentLines.push(`(${escaped}) Tj`);
      } else {
        contentLines.push("T*");
        contentLines.push(`(${escaped}) Tj`);
      }
    });

    contentLines.push("ET");
    const contentStream = contentLines.join("\n");
    const contentObjectNumber = addObject(
      `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`,
    );
    contentObjects.push(contentObjectNumber);

    const pageObjectNumber = addObject("");
    pageObjects.push(pageObjectNumber);
  });

  const kidRefs = pageObjects.map((number) => `${number} 0 R`).join(" ");
  objects[pagesObject - 1] = `<< /Type /Pages /Kids [ ${kidRefs} ] /Count ${pageObjects.length} >>`;
  objects[catalogObject - 1] = `<< /Type /Catalog /Pages ${pagesObject} 0 R >>`;

  pageObjects.forEach((pageObjectNumber, index) => {
    const contentObjectNumber = contentObjects[index];
    objects[pageObjectNumber - 1] = `<< /Type /Page /Parent ${pagesObject} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObject} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`;
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObject} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function wrapText(text, maxLength) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function escapePdfText(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}