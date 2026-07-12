'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { verifyOnChain, type BlockchainVerifyResult } from '@/lib/blockchain';

interface Certificate {
  certificate_code: string;
  certificate_type: string;
  candidate_name: string;
  course_name: string;
  cohort: string;
  date_issued: string;
  year_issued: number;
  tx_hash?: string;
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </main>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm font-medium flex-shrink-0">{label}</span>
      <span className={`text-gray-800 text-sm font-semibold text-right ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}

export default function VerifyPage() {
  const params = useParams();
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [chainResult, setChainResult] = useState<BlockchainVerifyResult | null>(null);
  const [chainLoading, setChainLoading] = useState(false);

  useEffect(() => {
    const rawCode = params.code;
    let code: string;

    if (Array.isArray(rawCode)) {
      if (rawCode.length === 1) {
        // Could be URL-encoded: "MA%2FCO1%2F26%2F00001"
        code = decodeURIComponent(rawCode[0]);
      } else {
        // Path split: ["MA", "CO1", "26", "00001"]
        code = rawCode.join('/');
      }
    } else {
      code = decodeURIComponent(rawCode as string);
    }

    if (!code) {
      setStatus('invalid');
      return;
    }

    supabase
      .from('certificates')
      .select('*')
      .eq('certificate_code', code)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setStatus('invalid');
        } else {
          const cert = data as Certificate;
          setCertificate(cert);
          setStatus('valid');
          // Run blockchain check after database lookup
          setChainLoading(true);
          verifyOnChain(code, cert.candidate_name, cert.course_name, cert.date_issued)
            .then(result => { setChainResult(result); setChainLoading(false); })
            .catch(() => setChainLoading(false));
        }
      });
  }, [params.code]);

  if (status === 'loading') return <LoadingState />;

  if (status === 'invalid') {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
          {/* Header */}
          <div className="mb-4">
            <p
              className="text-navy font-bold text-xl mb-1"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Metabridge Academy
            </p>
            <p className="text-gray-400 text-xs italic">Gateway to Digital Literacy</p>
          </div>

          {/* Red X icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-red-600 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 text-sm mb-2">
            This certificate could not be verified in our records.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            If you believe this is an error, please contact Metabridge Academy.
          </p>

          <a
            href="https://wa.me/2348124228730"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact Us on WhatsApp
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <p
            className="text-navy font-bold text-xl mb-1"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Metabridge Academy
          </p>
          <p className="text-gray-400 text-xs italic mb-6">Gateway to Digital Literacy</p>

          {/* Green checkmark */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-green-600 mb-2">Certificate Verified</h1>
          <p className="text-gray-500 text-sm">
            This certificate is authentic and was issued by Metabridge Academy
          </p>
        </div>

        {/* Certificate details card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <h2
            className="text-navy font-bold text-2xl mb-1"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {certificate!.candidate_name}
          </h2>
          <p className="text-gray-600 text-base mb-4">{certificate!.course_name}</p>

          <hr className="border-gray-200 mb-4" />

          <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm font-medium flex-shrink-0">Belt Level</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
              certificate!.certificate_type.startsWith('Green') ? 'bg-green-700' :
              certificate!.certificate_type.startsWith('Blue')  ? 'bg-blue-800'  :
              certificate!.certificate_type.startsWith('Black') ? 'bg-gray-900'  :
              'bg-navy'
            }`}>
              {certificate!.certificate_type}
            </span>
          </div>
          <DetailRow label="Date Issued" value={certificate!.date_issued} />
          <DetailRow label="Cohort" value={certificate!.cohort} />
          <DetailRow label="Certificate Code" value={certificate!.certificate_code} mono />

          <hr className="border-gray-200 mt-4 mb-3" />
          <p className="text-gray-400 text-xs italic text-center">
            Issued by Metabridge Academy, Port Harcourt
          </p>
        </div>

        {/* ── Blockchain Verification Section ── */}
        <div className="mb-6">
          {chainLoading && (
            <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl px-5 py-4">
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div>
                <p className="text-purple-700 text-sm font-semibold">Checking Polygon blockchain…</p>
                <p className="text-purple-500 text-xs">Querying on-chain registry</p>
              </div>
            </div>
          )}

          {!chainLoading && chainResult?.status === 'verified' && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-base">⛓️</span>
                </div>
                <div>
                  <p className="text-purple-800 font-bold text-sm">Blockchain Verified</p>
                  <p className="text-purple-500 text-xs">Permanently recorded on Polygon blockchain — cannot be forged</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400 flex-shrink-0">Network</span>
                  <span className="font-semibold text-purple-700">Polygon PoS Mainnet</span>
                </div>
                {chainResult.issuedAt && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400 flex-shrink-0">On-chain timestamp</span>
                    <span className="font-semibold">{chainResult.issuedAt.toUTCString()}</span>
                  </div>
                )}
                {certificate?.tx_hash && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-400 flex-shrink-0">Tx hash</span>
                    <a
                      href={`https://polygonscan.com/tx/${certificate.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-purple-600 hover:underline text-right break-all"
                    >
                      {certificate.tx_hash.slice(0, 20)}…{certificate.tx_hash.slice(-8)} ↗
                    </a>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400 flex-shrink-0">Data integrity</span>
                  <span className="text-green-600 font-semibold">✓ Hash matches certificate data</span>
                </div>
              </div>
            </div>
          )}

          {!chainLoading && chainResult?.status === 'tampered' && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-red-700 font-bold text-sm">Data Mismatch Detected</p>
                  <p className="text-red-500 text-xs">The certificate data does not match what is recorded on the blockchain. This certificate may have been tampered with.</p>
                </div>
              </div>
            </div>
          )}

          {!chainLoading && chainResult?.status === 'not_found' && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xl">🔗</span>
                <div>
                  <p className="text-gray-600 font-semibold text-sm">Database Verified</p>
                  <p className="text-gray-400 text-xs">This certificate was issued before blockchain integration was enabled.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="text-center">
          <a
            href="https://metabridgeacademy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal text-sm hover:underline"
          >
            Visit metabridgeacademy.com
          </a>
        </div>
      </div>
    </main>
  );
}
