'use client';

import { useState, useRef } from 'react';
import AuthGuard, { clearAdminAuth } from '@/app/_components/AuthGuard';
import CertificateA from '@/app/_components/CertificateA';
import CertificateB from '@/app/_components/CertificateB';
import {
  getNextSerial,
  buildCertificateCode,
  saveCertificate,
} from '@/lib/certificateCode';
import { downloadCertificatePDF } from '@/lib/pdfDownload';
import { useRouter } from 'next/navigation';

type CertType = 'completion' | 'achievement';

const COHORTS = [
  { label: 'Cohort 1', value: 'CO1' },
  { label: 'Cohort 2', value: 'CO2' },
  { label: 'Cohort 3', value: 'CO3' },
  { label: 'Cohort 4', value: 'CO4' },
  { label: 'Cohort 5', value: 'CO5' },
];

const COURSES: Record<CertType, string[]> = {
  completion: [
    'Cybersecurity Foundations',
    'Data Analytics Foundations',
    'Artificial Intelligence Foundations',
    'Blockchain Fundamentals',
  ],
  achievement: [
    'Cybersecurity',
    'Data Analytics',
    'Artificial Intelligence',
    'Blockchain & Cryptocurrency',
  ],
};

function getDateIssued(): string {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  return `${month}, ${year}`;
}

export default function GeneratePage() {
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);

  const [certType, setCertType] = useState<CertType>('completion');
  const [cohort, setCohort] = useState('CO1');
  const [courseName, setCourseName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const dateIssued = getDateIssued();

  const [certificateCode, setCertificateCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  function handleCertTypeChange(val: CertType) {
    setCertType(val);
    setCourseName('');
    setCertificateCode('');
    setIsGenerated(false);
  }

  function handleClearForm() {
    setCertType('completion');
    setCohort('CO1');
    setCourseName('');
    setCandidateName('');
    setCertificateCode('');
    setIsGenerated(false);
    setError('');
  }

  async function handleGenerate() {
    if (!candidateName.trim()) {
      setError('Please enter the candidate full name.');
      return;
    }
    if (!courseName) {
      setError('Please select a course name.');
      return;
    }
    setError('');
    setIsGenerating(true);

    try {
      const year = new Date().getFullYear();
      const serial = await getNextSerial(cohort);
      const code = buildCertificateCode(cohort, year, serial);

      setCertificateCode(code);

      // Wait for the child component's useEffect to generate the QR and re-render
      await new Promise((r) => setTimeout(r, 700));

      // Save to Supabase
      await saveCertificate({
        certificate_code: code,
        certificate_type: certType === 'completion'
          ? 'Certificate of Completion'
          : 'Certificate of Achievement',
        candidate_name: candidateName.trim(),
        course_name: courseName,
        cohort,
        serial_number: serial,
        year_issued: year,
        date_issued: dateIssued,
      });

      // Download PDF
      await downloadCertificatePDF(certificateRef, code);

      setIsGenerated(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(`Error: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownloadAgain() {
    if (!certificateCode) return;
    await downloadCertificatePDF(certificateRef, certificateCode);
  }

  function handleLogout() {
    clearAdminAuth();
    router.replace('/admin');
  }

  const certProps = {
    candidateName: candidateName || 'Candidate Full Name',
    courseName: courseName || 'Course Name',
    dateIssued,
    certificateCode,
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
            <p className="font-mono text-navy font-bold text-xl mb-4">{certificateCode}</p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleDownloadAgain}
                className="bg-navy text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                Download PDF Again
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
            <h2 className="text-navy font-bold text-2xl mb-6" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Generate Certificate
            </h2>

            <div className="space-y-5">
              {/* Certificate Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Certificate Type
                </label>
                <select
                  value={certType}
                  onChange={(e) => handleCertTypeChange(e.target.value as CertType)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal bg-white"
                >
                  <option value="completion">Certificate of Completion</option>
                  <option value="achievement">Certificate of Achievement</option>
                </select>
              </div>

              {/* Cohort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Cohort
                </label>
                <select
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal bg-white"
                >
                  {COHORTS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} ({c.value})
                    </option>
                  ))}
                </select>
              </div>

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
                  {COURSES[certType].map((c) => (
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

              {/* Date Issued (read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Date of Issue
                </label>
                <input
                  type="text"
                  value={dateIssued}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-500 bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* Certificate Code Preview */}
              {certificateCode && (
                <div className="bg-navy/5 border border-navy/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Certificate Code</p>
                  <p className="font-mono text-navy font-bold text-lg">{certificateCode}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  {error}
                </p>
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
                  {isGenerating ? 'Generating...' : 'Generate & Download PDF'}
                </button>
              </div>
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
            <h2 className="text-navy font-bold text-2xl mb-4" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Live Preview
            </h2>
            <p className="text-gray-500 text-sm mb-4">Updates as you fill in the form</p>

            <div className="flex justify-center">
              <div className="certificate-preview-wrapper border border-gray-100 rounded shadow-sm">
                <div className="certificate-preview-scale">
                  {certType === 'completion' ? (
                    <CertificateA {...certProps} divRef={certificateRef} />
                  ) : (
                    <CertificateB {...certProps} divRef={certificateRef} />
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              The PDF will be A4 landscape at full resolution
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
                {certType === 'completion' ? (
                  <CertificateA {...certProps} />
                ) : (
                  <CertificateB {...certProps} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
