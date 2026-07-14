import { supabase } from './supabase';

export async function getNextSerial(): Promise<number> {
  const { data } = await supabase
    .from('certificates')
    .select('serial_number')
    .order('serial_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? (data.serial_number as number) + 1 : 1;
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
