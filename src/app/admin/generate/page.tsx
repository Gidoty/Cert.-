'use client';

import { useState } from 'react';
import AuthGuard, { clearAdminAuth } from '@/app/_components/AuthGuard';
import CertificateA from '@/app/_components/CertificateA';
import CertificateB from '@/app/_components/CertificateB';
import { saveCertificate, checkDuplicateCode, updateTxHash, getNextSerial } from '@/lib/certificateCode';
import { useRouter } from 'next/navigation';

type BeltLevel = 'green' | 'blue' | 'black';

const BELT_META: Record<BeltLevel, { label: string; subtitle: string; color: string; borderColor: string; bgColor: string; dotColor: string; certType: string }> = {
  green: {
    label: 'Green Belt',
    subtitle: 'Foundation',
    color: '#14532D',
    borderColor: '#16A34A',
    bgColor: '#F0FDF4',
    dotColor: '#86EFAC',
    certType: 'Green Belt — Foundation',
  },
  blue: {
    label: 'Blue Belt',
    subtitle: 'Professional',
    color: '#1e3a8a',
    borderColor: '#3B82F6',
    bgColor: '#EFF6FF',
    dotColor: '#93C5FD',
    certType: 'Blue Belt — Professional',
  },
  black: {
    label: 'Black Belt',
    subtitle: 'Mastery',
    color: '#0D0A00',
    borderColor: '#C9A84C',
    bgColor: '#1C1400',
    dotColor: '#C9A84C',
    certType: 'Black Belt — Mastery',
  },
};

const COURSES: Record<BeltLevel, string[]> = {
  green: [
    'Cybersecurity Foundations',
    'Data Analytics Foundations',
    'Artificial Intelligence Foundations',
    'Blockchain Fundamentals',
  ],
  blue: [
    'Cybersecurity Professional',
    'Data Analytics Professional',
    'Artificial Intelligence Professional',
    'Blockchain & Cryptocurrency Professional',
  ],
  black: [
    'Advanced Cybersecurity',
    'Advanced Data Analytics',
    'Advanced Artificial Intelligence',
    'Advanced Blockchain & Cryptocurrency',
  ],
};

export default function GeneratePage() {
  const router = useRouter();

  const [beltLevel, setBeltLevel] = useState<BeltLevel>('green');
  const [cohort, setCohort] = useState('');
  const [courseName, setCourseName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [dateIssued, setDateIssued] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Blockchain state
  const [blockchainStatus, setBlockchainStatus] = useState<'idle' | 'pending' | 'confirmed' | 'failed'>('idle');
  const [txHash, setTxHash] = useState('');
  const [polygonscanUrl, setPolygonscanUrl] = useState('');

  // Code prefix shown live — serial assigned automatically at save time
  const yy = dateIssued.match(/\d{4}/)?.[0]?.slice(-2) ?? '';
  const codePrefix = cohort.trim() && yy ? `MA/${cohort.trim()}/${yy}/` : '';

  function handleBeltChange(val: BeltLevel) {
    setBeltLevel(val);
    setCourseName('');
    setIsGenerated(false);
  }

  function handleClearForm() {
    setBeltLevel('green');
    setCohort('');
    setCourseName('');
    setCandidateName('');
    setDateIssued('');
    setIsGenerated(false);
    setGeneratedCode('');
    setError('');
  }

  async function handleGenerate() {
    if (!cohort.trim()) {
      setError('Please enter the cohort (e.g. C1).');
      return;
    }
    if (!candidateName.trim()) {
      setError('Please enter the candidate full name.');
      return;
    }
    if (!courseName) {
      setError('Please select a course name.');
      return;
    }
    if (!dateIssued.trim()) {
      setError('Please enter the date of issue (e.g. August, 2026).');
      return;
    }

    setError('');
    setIsGenerating(true);

    // Auto-assign next serial number for this cohort (3-digit padded)
    const serial = await getNextSerial(cohort.trim());
    const paddedSerial = String(serial).padStart(3, '0');
    const yearSuffix = dateIssued.match(/\d{4}/)?.[0]?.slice(-2) ?? String(new Date().getFullYear()).slice(-2);
    const code = `MA/${cohort.trim()}/${yearSuffix}/${paddedSerial}`;

    const isDuplicate = await checkDuplicateCode(code);

    if (!isDuplicate) {
      await saveCertificate({
        certificate_code: code,
        certificate_type: BELT_META[beltLevel].certType,
        candidate_name: candidateName.trim(),
        course_name: courseName,
        cohort: cohort.trim(),
        serial_number: serial,
        year_issued: new Date().getFullYear(),
        date_issued: dateIssued.trim(),
      });
    }
    // If duplicate, record already exists in Supabase (synced from Google Sheet) — skip save and proceed to print

    setGeneratedCode(code);
    setIsGenerated(true);
    setIsGenerating(false);

    // ── Blockchain anchoring (non-blocking — runs after UI updates) ──
    setBlockchainStatus('pending');
    setTxHash('');
    setPolygonscanUrl('');
    try {
      const res = await fetch('/api/blockchain/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          candidateName: candidateName.trim(),
          courseName,
          dateIssued: dateIssued.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTxHash(data.txHash);
        setPolygonscanUrl(data.polygonscan);
        setBlockchainStatus('confirmed');
        await updateTxHash(code, data.txHash).catch(() => {});
      } else if (res.status === 409) {
        // Already on-chain (re-issue of existing cert)
        setBlockchainStatus('confirmed');
      } else if (res.status === 503) {
        // Blockchain not yet configured — silent skip
        setBlockchainStatus('idle');
      } else {
        setBlockchainStatus('failed');
      }
    } catch {
      setBlockchainStatus('failed');
    }
  }

  function handleLogout() {
    clearAdminAuth();
    router.replace('/admin');
  }

  const certProps = {
    candidateName: candidateName || 'Candidate Full Name',
    courseName: courseName || 'Course Name',
    dateIssued,
    certificateCode: generatedCode, // only populated after save — QR appears then
  };

  return (
    <AuthGuard>
      {/* ── NAV ── */}
      <nav className="bg-navy text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <span
            className="font-bold text-xl"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Metabridge Academy
          </span>
          <span className="ml-3 text-sm text-blue-200 italic">Certificate Generator</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>

      <main className="min-h-screen bg-gray-50 p-6">
        {/* ── SUCCESS BANNER ── */}
        {isGenerated && (
          <div className="max-w-3xl mx-auto mb-6 bg-green-50 border border-green-200 rounded-xl p-6 shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                ✓
              </div>
              <h2 className="text-green-700 font-bold text-lg">Certificate Generated Successfully</h2>
            </div>
            <p className="text-gray-600 text-sm mb-1">Certificate Code:</p>
            <p className="font-mono text-navy font-bold text-xl mb-3">{generatedCode}</p>

            {/* Blockchain status */}
            {blockchainStatus === 'pending' && (
              <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 mb-3">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-purple-700 text-sm font-medium">Anchoring on Polygon blockchain…</span>
              </div>
            )}
            {blockchainStatus === 'confirmed' && txHash && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">⛓️</span>
                  <span className="text-purple-700 text-sm font-bold">Anchored on Polygon Blockchain</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
                <a
                  href={polygonscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-purple-600 hover:underline break-all"
                >
                  {txHash}
                </a>
                <span className="ml-2 text-purple-400 text-xs">↗ Polygonscan</span>
              </div>
            )}
            {blockchainStatus === 'failed' && (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 mb-3">
                <span className="text-yellow-600 text-sm">⚠️ Blockchain anchoring failed — certificate is still valid in the database.</span>
              </div>
            )}

            <p className="text-gray-500 text-xs mb-4">
              Tip: In the print dialog, select <strong>Save as PDF</strong> and enable{' '}
              <strong>Background graphics</strong> for full colour.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  const cert = document.getElementById('certificate-print-area')
                  if (!cert) { alert('Please fill all fields first'); return }
                  const w = window.open('', '_blank')
                  w!.document.write(`
                    <html>
                    <head>
                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
                    <style>
                      @page { size: A4 landscape; margin: 0; }
                      body { margin: 0; padding: 0; }
                      * { -webkit-print-color-adjust: exact !important;
                          print-color-adjust: exact !important; }
                    </style>
                    </head>
                    <body>${cert.outerHTML}</body>
                    </html>
                  `)
                  w!.document.close()
                  setTimeout(() => { w!.focus(); w!.print() }, 1500)
                }}
                className="bg-navy text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                Download / Print Certificate
              </button>
              <button
                onClick={handleClearForm}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Generate Another Certificate
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── LEFT: FORM ── */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2
              className="text-navy font-bold text-2xl mb-6"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Generate Certificate
            </h2>

            <div className="space-y-5">
              {/* Belt Level Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Belt Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(BELT_META) as [BeltLevel, typeof BELT_META['green']][]).map(([key, meta]) => {
                    const selected = beltLevel === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleBeltChange(key)}
                        style={{
                          borderColor: selected ? meta.borderColor : '#E5E7EB',
                          backgroundColor: selected ? meta.bgColor : '#FFFFFF',
                        }}
                        className="relative rounded-xl border-2 p-3 text-left transition-all cursor-pointer"
                      >
                        {/* Coloured top stripe */}
                        <div
                          className="h-1.5 w-10 rounded-full mb-2"
                          style={{ background: meta.borderColor }}
                        />
                        <div
                          className="font-bold text-xs leading-tight"
                          style={{ color: selected ? meta.color : '#374151' }}
                        >
                          {meta.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{meta.subtitle}</div>
                        {selected && (
                          <div
                            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: meta.borderColor }}
                          >
                            <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cohort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Cohort
                </label>
                <input
                  type="text"
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                  placeholder="e.g. C1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>

              {/* Date of Issue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Date of Issue
                </label>
                <input
                  type="text"
                  value={dateIssued}
                  onChange={(e) => setDateIssued(e.target.value)}
                  placeholder="e.g. June, 2026"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>

              {/* Auto certificate code preview */}
              {codePrefix && (
                <div className="bg-navy/5 border border-navy/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">
                    Certificate Code (auto-assigned)
                  </p>
                  <p className="font-mono text-navy font-bold text-lg">
                    {codePrefix}<span className="text-gray-400">###</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Serial number assigned automatically — next in sequence for cohort {cohort.trim()}
                  </p>
                </div>
              )}

              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Course Name
                </label>
                <select
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal bg-white"
                >
                  <option value="">— Select a course —</option>
                  {COURSES[beltLevel].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Candidate Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter full name exactly as it should appear"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>

              {/* Error / Duplicate Warning */}
              {error && (
                <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap pt-2">
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="flex-1 bg-white border-2 border-navy text-navy py-3 rounded-lg font-semibold hover:bg-navy hover:text-white transition text-sm"
                >
                  Preview Certificate
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 bg-navy text-white py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
              <button
                onClick={() => {
                  const cert = document.getElementById('certificate-print-area')
                  if (!cert) { alert('Please fill all fields first'); return }
                  const w = window.open('', '_blank')
                  w!.document.write(`
                    <html>
                    <head>
                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
                    <style>
                      @page { size: A4 landscape; margin: 0; }
                      body { margin: 0; padding: 0; }
                      * { -webkit-print-color-adjust: exact !important;
                          print-color-adjust: exact !important; }
                    </style>
                    </head>
                    <body>${cert.outerHTML}</body>
                    </html>
                  `)
                  w!.document.close()
                  setTimeout(() => { w!.focus(); w!.print() }, 1500)
                }}
                className="w-full bg-teal text-white py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm"
              >
                Download / Print Certificate
              </button>
              <button
                onClick={handleClearForm}
                className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition"
              >
                Clear Form
              </button>
            </div>
          </div>

          {/* ── RIGHT: LIVE PREVIEW ── */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2
              className="text-navy font-bold text-2xl mb-4"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Live Preview
            </h2>
            <p className="text-gray-500 text-sm mb-4">Updates as you fill in the form</p>

            <div className="flex justify-center">
              <div className="certificate-preview-wrapper border border-gray-100 rounded shadow-sm">
                <div className="certificate-preview-scale">
                  <div id="certificate-print-area">
                    {beltLevel === 'green' ? (
                      <CertificateA {...certProps} />
                    ) : (
                      <CertificateB {...certProps} beltLevel={beltLevel} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Prints at A4 landscape · Enable &ldquo;Background graphics&rdquo; in print dialog
            </p>
          </div>
        </div>
      </main>

      {/* ── PREVIEW MODAL ── */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl overflow-auto max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b">
              <h3 className="font-bold text-navy text-lg">Full Certificate Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <div style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: 1122, height: 793 }}>
                {beltLevel === 'green' ? (
                  <CertificateA {...certProps} />
                ) : (
                  <CertificateB {...certProps} beltLevel={beltLevel} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
