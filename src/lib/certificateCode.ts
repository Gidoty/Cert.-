import { supabase, isSupabaseConfigured } from './supabase';

export async function getNextSerial(): Promise<number> {
  if (!isSupabaseConfigured) {
    // Fallback: use a timestamp-derived serial when Supabase isn't configured
    return Math.floor(Date.now() / 1000) % 1000 + 1;
  }
  const { data, error } = await supabase
    .from('certificates')
    .select('serial_number')
    .order('serial_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Database error: ${error.message}`);
  return data ? (data.serial_number as number) + 1 : 1;
}

export function buildCertificateCode(cohort: string, year: number, serial: number): string {
  const yy = String(year).slice(-2);
  const nn = String(serial).padStart(3, '0');
  return `MB/${cohort}/${nn}/${yy}`;
}

export async function checkDuplicateCode(code: string): Promise<boolean> {
  const { data } = await supabase
    .from('certificates')
    .select('id')
    .eq('certificate_code', code)
    .maybeSingle();
  return data !== null;
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

export async function updateTxHash(code: string, txHash: string): Promise<void> {
  const { error } = await supabase
    .from('certificates')
    .update({ tx_hash: txHash })
    .eq('certificate_code', code);
  if (error) throw error;
}
