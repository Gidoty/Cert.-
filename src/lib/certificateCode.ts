import { supabase } from './supabase';

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
