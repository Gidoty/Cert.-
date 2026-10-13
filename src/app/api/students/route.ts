import { NextResponse } from 'next/server';

const SHEET_ID = '1n49CjCnNxWX9sEaUUb0Vpjz14i6m4j-3cFwOk2ClEx4';

function csvUrl(sheet: string) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { cell += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      row.push(cell.trim()); cell = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      row.push(cell.trim()); rows.push(row); row = []; cell = '';
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows.filter(r => r.some(c => c));
}

export async function GET() {
  try {
    const [masterRes, c1Res, c2Res, c3Res, c4Res, c5Res] = await Promise.allSettled([
      fetch(csvUrl('MASTER_REGISTER'), { next: { revalidate: 300 } }),
      fetch(csvUrl('C1_ATTENDANCE'), { next: { revalidate: 300 } }),
      fetch(csvUrl('C2_ATTENDANCE'), { next: { revalidate: 300 } }),
      fetch(csvUrl('C3_ATTENDANCE'), { next: { revalidate: 300 } }),
      fetch(csvUrl('C4_ATTENDANCE'), { next: { revalidate: 300 } }),
      fetch(csvUrl('C5_ATTENDANCE'), { next: { revalidate: 300 } }),
    ]);

    if (masterRes.status !== 'fulfilled' || !masterRes.value.ok) {
      return NextResponse.json({ error: 'Failed to load student register' }, { status: 500 });
    }

    const masterText = await masterRes.value.text();
    const masterRows = parseCSV(masterText);
    // MASTER_REGISTER: S/N | Student ID | Full Name | Cohort | Email
    const masterData = masterRows.slice(1).filter(r => r[1] && r[2]);

    // Build belt+course map from attendance sheets
    const beltMap: Record<string, { belt: string; course: string }> = {};
    const attendanceResults = [c1Res, c2Res, c3Res, c4Res, c5Res];
    for (const res of attendanceResults) {
      if (res.status !== 'fulfilled' || !res.value.ok) continue;
      const text = await res.value.text();
      const rows = parseCSV(text);
      // C*_ATTENDANCE: S/N | Student ID | Full Name | Course | Belt | Date | Status
      for (const row of rows.slice(1)) {
        const studentId = row[1]?.trim();
        const course = row[3]?.trim();
        const belt = row[4]?.trim();
        if (studentId && course && belt) {
          beltMap[studentId] = { belt, course };
        }
      }
    }

    const students = masterData.map(row => {
      const studentId = row[1]?.trim() || '';
      const beltInfo = beltMap[studentId];
      return {
        studentId,
        fullName: row[2]?.trim() || '',
        cohort: row[3]?.trim() || '',
        email: row[4]?.trim() || '',
        belt: beltInfo?.belt || '',
        course: beltInfo?.course || '',
      };
    }).filter(s => s.studentId && s.fullName);

    return NextResponse.json({ students });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
