import { BookOpen, FileText, Download } from "lucide-react";

// Google Sheet published as CSV (File → Share → Publish to web → CSV).
// Expected header row:
//   semester | subject_id | subject_name | subject_image | resource_name | resource_url | icon
// One row per resource. `icon` is one of: book, file, download (defaults to file).
// A row with an empty resource_name just declares the subject.
const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL;
const FETCH_TIMEOUT_MS = 8000;

const ICONS = { book: BookOpen, file: FileText, download: Download };

// Minimal RFC 4180 CSV parser (handles quoted fields, escaped quotes, newlines in quotes).
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function rowsToSemesterData(rows) {
  const [header, ...body] = rows;
  const col = Object.fromEntries(header.map((h, i) => [h.trim().toLowerCase(), i]));
  const get = (r, key) => (r[col[key]] ?? "").trim();

  const data = {};
  for (const r of body) {
    const sem = get(r, "semester").replace(/^s/i, "");
    const subjectId = get(r, "subject_id");
    if (!sem || !subjectId) continue;

    const semKey = `s${sem}`;
    data[semKey] ??= { name: `Semester ${sem}`, subjects: [] };

    let subject = data[semKey].subjects.find((s) => s.id === subjectId);
    if (!subject) {
      subject = {
        id: subjectId,
        name: get(r, "subject_name"),
        image: get(r, "subject_image"),
        semester: semKey,
        semesterName: data[semKey].name,
        resources: [],
      };
      data[semKey].subjects.push(subject);
    }

    const resourceName = get(r, "resource_name");
    if (resourceName) {
      subject.resources.push({
        name: resourceName,
        url: get(r, "resource_url") || "#",
        icon: ICONS[get(r, "icon").toLowerCase()] ?? FileText,
      });
    }
  }

  // Keep semesters in numeric order regardless of row order in the sheet.
  return Object.fromEntries(
    Object.entries(data).sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)))
  );
}

export async function loadSemesterData() {
  if (!SHEET_CSV_URL) throw new Error("VITE_SHEET_CSV_URL is not set");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHEET_CSV_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const data = rowsToSemesterData(parseCSV(await res.text()));
    if (!Object.keys(data).length) throw new Error("Sheet returned no data");
    return data;
  } finally {
    clearTimeout(timer);
  }
}
