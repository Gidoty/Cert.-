import { supabase } from './supabase';

export async function getNextSerial(cohort: string): Promise<number> {
  const { data, error } = await supabase
    .from('certificates')
    .select('serial_number')
    .eq('cohort', cohort)
    .order('serial_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 1;
  return (data.serial_number as number) + 1;
}

export function buildCertificateCode(cohort: string, year: number, serial: number): string {
  const yy = String(year).slice(-2);
  const nn = String(serial).padStart(5, '0');
  return `MA/${cohort}/${yy}/${nn}`;
}

export async function saveCertificate(payload: {
  certificate_code: string;
  certificate_type: string;
  candidate_name: string;
  course_name: string;
  cohort: string;
  serial_number: number;
  year_issued: number;
  date_issued: string;
}): Promise<void> {
  const { error } = await supabase.from('certificates').insert([payload]);
  if (error) throw error;
}
