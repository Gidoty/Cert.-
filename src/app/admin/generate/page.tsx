'use client';

import { useState, useRef, useEffect } from 'react';
import AuthGuard, { clearAdminAuth } from '@/app/_components/AuthGuard';
import CertificateA from '@/app/_components/CertificateA';
import {
  getNextSerial,
  buildCertificateCode,
  saveCertificate,
} from '@/lib/certificateCode';
import { downloadCertificatePDF } from '@/lib/pdfDownload';
import { useRouter } from 'next/navigation';

type BeltLevel = 'Green Belt' | 'Blue Belt' | 'Black Belt';

interface Student {
  studentId: string;
  fullName: string;
  cohort: string;
  email: string;
  belt: string;
  course: string;
}

const ALL_COURSES = [
  'Artificial Intelligence',
  'Blockchain Technology',
  'Cybersecurity',
  'Data Analytics',
  'Web Development',
  'Virtual Assistant',
  'UI/UX Design',
  'App Development',
  'Social Media Marketing',
  'Video Editing',
  'Digital Marketing & Growth',
  'Graphics Design',
  'Mobile App Development',
  'Cloud Computing & Fundamentals',
  'E-Commerce & Business Development',
];

const BELT_LEVELS: BeltLevel[] = ['Green Belt', 'Blue Belt', 'Black Belt'];
const BELT_LABEL: Record<BeltLevel, string> = {
  'Green Belt': 'Green Belt (Foundation)',
  'Blue Belt': 'Blue Belt (Professional)',
  'Black Belt': 'Black Belt (Mastery)',
};

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const YEARS = Array.from({ length: 8 }, (_, i) => 2024 + i);

export default function GeneratePage() {
  const router = useRouter();
  const certificateRef = useRef<HTMLDivElement>(null);

  // Student lookup
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form fields
  const [beltLevel, setBeltLevel] = useState<BeltLevel>('Green Belt');
  const [cohort, setCohort] = useState('');
  const [courseName, setCourseName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [issueMonth, setIssueMonth] = useState(() => new Date().toLocaleString('en-US', { month: 'long' }));
  const [issueYear, setIssueYear] = useState(() => new Date().getFullYear());
  const dateIssued = `${issueMonth}, ${issueYear}`;

  // State
  const [certificateCode, setCertificateCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load students from sheet
  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(d => { if (d.students) setStudents(d.students); })
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, []);

  // Filtered suggestions
  const suggestions = searchQuery.length >= 2
    ? students.filter(s =>
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  function selectStudent(s: Student) {
    setSelectedStudent(s);
    setCandidateName(s.fullName);
    setStudentId(s.studentId);
    setCohort(s.cohort);
    if (s.belt) setBeltLevel(s.belt as BeltLevel);
    if (s.course) setCourseName(s.course);
    setSearchQuery(s.fullName);
    setShowDropdown(false);
    setCertificateCode('');
    setIsGenerated(false);
    setError('');
  }

  function handleClearForm() {
    setSelectedStudent(null);
    setSearchQuery('');
    setCandidateName('');
    setStudentId('');
    setCohort('');
    setCourseName('');
    setBeltLevel('Green Belt');
    setCertificateCode('');
    setIsGenerated(false);
    setError('');
    setIssueMonth(new Date().toLocaleString('en-US', { month: 'long' }));
    setIssueYear(new Date().getFullYear());
  }

  async function handleGenerate() {
    if (!candidateName.trim()) { setError('Please enter the candidate full name.'); return; }
    if (!courseName) { setError('Please select a course name.'); return; }
    setError('');
    setIsGenerating(true);
    try {
      const year = issueYear;
      const cohortVal = cohort || 'C1';
      const serial = await getNextSerial();
      const code = buildCertificateCode(cohortVal, year, serial);
      setCertificateCode(code);

      // Wait for React to re-render with new code, then for QR code async generation to complete
      await new Promise(r => setTimeout(r, 1800));

      await saveCertificate({
        certificate_code: code,
        certificate_type: beltLevel,
        candidate_name: candidateName.trim(),
        course_name: courseName,
        cohort: cohortVal,
        serial_number: serial,
        year_issued: year,
        date_issued: dateIssued,
      });

      await downloadCertificatePDF(certificateRef, code);
      setIsGenerated(true);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Something went wrong.'}`);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownloadAgain() {
    if (!certificateCode) return;
    await downloadCertificatePDF(certificateRef, certificateCode);
  }

  const certProps = {
    candidateName: candidateName || 'Candidate Full Name',
    courseName: courseName || 'Course Name',
    dateIssued,
    certificateCode,
    studentId,
  };

  return (
    <AuthGuard>
      <nav className="bg-navy text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <span className="font-bold text-xl" style={{ fontFamily:'var(--font-playfair), serif' }}>
            Metabridge Academy
          </span>
          <span className="ml-3 text-sm text-blue-200 italic">Certificate Generator</span>
        </div>
        <button
          onClick={() => { clearAdminAuth(); router.replace('/admin'); }}
          className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>

      <main className="min-h-screen bg-gray-50 p-6">
        {isGenerated && (
          <div className="max-w-3xl mx-auto mb-6 bg-green-50 border border-green-200 rounded-xl p-6 shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">✓</div>
              <h2 className="text-green-700 font-bold text-lg">Certificate Generated Successfully</h2>
            </div>
            <p className="text-gray-600 text-sm mb-1">Certificate Code:</p>
            <p className="font-mono text-navy font-bold text-xl mb-4">{certificateCode}</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleDownloadAgain}
                className="bg-navy text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition">
                Download PDF Again
              </button>
              <button onClick={handleClearForm}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Generate Another
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FORM */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-navy font-bold text-2xl mb-6" style={{ fontFamily:'var(--font-playfair), serif' }}>
              Generate Certificate
            </h2>

            <div className="space-y-5">
              {/* Student Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Search Student
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); setSelectedStudent(null); setCandidateName(e.target.value); }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 180)}
                    placeholder={loadingStudents ? 'Loading students...' : 'Type name or Student ID…'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                      {suggestions.map(s => (
                        <button
                          key={s.studentId}
                          onMouseDown={() => selectStudent(s)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition"
                        >
                          <div className="font-semibold text-gray-800 text-sm">{s.fullName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {s.studentId}
                            {s.cohort && ` · ${s.cohort}`}
                            {s.belt && ` · ${s.belt}`}
                            {s.course && ` · ${s.course}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedStudent && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 flex items-center gap-2">
                    <span className="font-mono font-semibold">{selectedStudent.studentId}</span>
                    <span>·</span>
                    <span>{selectedStudent.cohort}</span>
                    {selectedStudent.email && <><span>·</span><span>{selectedStudent.email}</span></>}
                  </div>
                )}
              </div>

              {/* Belt Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Belt Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {BELT_LEVELS.map(lvl => {
                    const active = beltLevel === lvl;
                    const cls: Record<BeltLevel, string> = {
                      'Green Belt': active ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600 hover:border-green-600',
                      'Blue Belt':  active ? 'bg-blue-800 text-white border-blue-800'  : 'border-gray-300 text-gray-600 hover:border-blue-700',
                      'Black Belt': active ? 'bg-gray-900 text-white border-gray-900'  : 'border-gray-300 text-gray-600 hover:border-gray-700',
                    };
                    return (
                      <button key={lvl} onClick={() => { setBeltLevel(lvl); setCertificateCode(''); setIsGenerated(false); }}
                        className={`border-2 rounded-lg py-2 text-xs font-bold transition ${cls[lvl]}`}>
                        {BELT_LABEL[lvl]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Course Name</label>
                <select value={courseName} onChange={e => setCourseName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal bg-white">
                  <option value="">— Select a course —</option>
                  {ALL_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Candidate Name (manual fallback) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Candidate Full Name</label>
                <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)}
                  placeholder="Auto-filled from search, or enter manually"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"/>
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Student ID</label>
                <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)}
                  placeholder="Auto-filled from student lookup"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal"/>
              </div>

              {/* Cohort (read-only if auto-filled) */}
              {cohort && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Cohort</label>
                  <input type="text" value={cohort} readOnly
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-500 bg-gray-50 cursor-not-allowed"/>
                </div>
              )}

              {/* Date of Issue — editable */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Date of Issue</label>
                <div className="grid grid-cols-2 gap-3">
                  <select value={issueMonth} onChange={e => setIssueMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal bg-white">
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={issueYear} onChange={e => setIssueYear(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal bg-white">
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <p className="text-xs text-gray-400 mt-1">Will appear as: <span className="font-medium text-gray-600">{dateIssued}</span></p>
              </div>

              {certificateCode && (
                <div className="bg-navy/5 border border-navy/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Certificate Code</p>
                  <p className="font-mono text-navy font-bold text-lg">{certificateCode}</p>
                </div>
              )}

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
              )}

              <div className="flex gap-3 flex-wrap pt-2">
                <button onClick={() => setShowPreviewModal(true)}
                  className="flex-1 bg-white border-2 border-navy text-navy py-3 rounded-lg font-semibold hover:bg-navy hover:text-white transition text-sm">
                  Preview
                </button>
                <button onClick={handleGenerate} disabled={isGenerating}
                  className="flex-1 bg-navy text-white py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {isGenerating ? 'Generating…' : 'Generate & Download PDF'}
                </button>
              </div>
              <button onClick={handleClearForm} className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition">
                Clear Form
              </button>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-navy font-bold text-2xl mb-2" style={{ fontFamily:'var(--font-playfair), serif' }}>
              Live Preview
            </h2>
            <p className="text-gray-500 text-sm mb-4">Updates as you fill in the form</p>
            <div className="flex justify-center">
              <div className="certificate-preview-wrapper border border-gray-100 rounded shadow-sm">
                <div className="certificate-preview-scale">
                  <CertificateA {...certProps} beltLevel={beltLevel} divRef={certificateRef}/>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">QR code appears after generating · PDF saved as 210×210mm square</p>
          </div>
        </div>
      </main>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl overflow-auto max-w-full max-h-full"
            onClick={e => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between border-b">
              <h3 className="font-bold text-navy text-lg">Full Certificate Preview</h3>
              <button onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl leading-none">×</button>
            </div>
            <div className="p-4 overflow-auto">
              <div style={{ transform:'scale(0.65)', transformOrigin:'top left', width:794, height:794 }}>
                <CertificateA {...certProps} beltLevel={beltLevel}/>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
