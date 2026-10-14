import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

export async function POST() {
  try {
    const [masterRes, c1Res, c2Res, c3Res, c4Res, c5Res] = await Promise.allSettled([
      fetch(csvUrl('MASTER_REGISTER')),
      fetch(csvUrl('C1_ATTENDANCE')),
      fetch(csvUrl('C2_ATTENDANCE')),
      fetch(csvUrl('C3_ATTENDANCE')),
      fetch(csvUrl('C4_ATTENDANCE')),
      fetch(csvUrl('C5_ATTENDANCE')),
    ]);

    if (masterRes.status !== 'fulfilled' || !masterRes.value.ok) {
      return NextResponse.json({ error: 'Failed to load MASTER_REGISTER sheet' }, { status: 500 });
    }

    const masterText = await masterRes.value.text();
    const masterRows = parseCSV(masterText);
    const masterData = masterRows.slice(1).filter(r => r[1] && r[2]);

    const beltMap: Record<string, { belt: string; course: string }> = {};
    for (const res of [c1Res, c2Res, c3Res, c4Res, c5Res]) {
      if (res.status !== 'fulfilled' || !res.value.ok) continue;
      const rows = parseCSV(await res.value.text());
      for (const row of rows.slice(1)) {
        const sid = row[1]?.trim();
        const course = row[3]?.trim();
        const belt = row[4]?.trim();
        if (sid && course && belt) beltMap[sid] = { belt, course };
      }
    }

    const seen = new Set<string>();
    const students = masterData.map(row => {
      const student_id = row[1]?.trim() || '';
      const info = beltMap[student_id] || { belt: '', course: '' };
      return {
        student_id,
        full_name:  row[2]?.trim() || '',
        cohort:     row[3]?.trim() || '',
        email:      row[4]?.trim() || '',
        belt:       info.belt,
        course:     info.course,
        synced_at:  new Date().toISOString(),
      };
    }).filter(s => {
      if (!s.student_id || !s.full_name) return false;
      if (seen.has(s.student_id)) return false;
      seen.add(s.student_id);
      return true;
    });

    if (students.length === 0) {
      return NextResponse.json({ error: 'No students found in sheet' }, { status: 400 });
    }

    // Upsert all students (insert or update by primary key student_id)
    const { error } = await supabase
      .from('students')
      .upsert(students, { onConflict: 'student_id' });

    if (error) {
      const msg = `${error.message} (code: ${error.code})${error.details ? ' — ' + error.details : ''}`;
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ synced: students.length });
  } catch (err) {
    let msg = 'Unknown error';
    if (err instanceof Error) msg = err.message;
    else if (err && typeof err === 'object' && 'message' in err) msg = String((err as {message: unknown}).message);
    else msg = JSON.stringify(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
