import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const { data, error } = await supabase
    .from('certificates')
    .select('certificate_code,certificate_type,candidate_name,course_name,cohort,date_issued,year_issued,tx_hash')
    .eq('certificate_code', code.toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ found: false }, {
      status: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  return NextResponse.json({ found: true, certificate: data }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
