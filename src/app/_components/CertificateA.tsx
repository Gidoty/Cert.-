'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

type BeltLevel = 'Green Belt' | 'Blue Belt' | 'Black Belt';

interface CertificateAProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  studentId?: string;
  beltLevel?: BeltLevel;
  divRef?: RefObject<HTMLDivElement>;
}

const NAVY  = '#163B6B';   // medium-dark blue (lighter, clearly blue not near-black)
const GOLD  = '#C9A84C';
const TEAL  = '#2BC8D4';
const CREAM = '#F4F5F0';

const CERT_SUBTITLE: Record<BeltLevel, string> = {
  'Green Belt': 'OF COMPLETION',
  'Blue Belt':  'OF ACHIEVEMENT',
  'Black Belt': 'OF MASTERY',
};

const ACK = 'In recognition of demonstrated technical competence, practical excellence, and commitment to building future-ready capabilities through digital technology.';

export default function CertificateA({
  candidateName,
  courseName,
  dateIssued,
  certificateCode,
  studentId,
  beltLevel = 'Green Belt',
  divRef,
}: CertificateAProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!certificateCode) return;
    QRCode.toDataURL(
      `https://cert-ashen.vercel.app/verify/${encodeURIComponent(certificateCode)}`,
      { margin: 1, width: 90, color: { dark: '#0D1B2E', light: '#FFFFFF' } }
    ).then(setQrDataUrl);
  }, [certificateCode]);

  return (
    <div
      ref={divRef}
      style={{
        width: 1123, height: 794,
        position: 'relative', overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        backgroundColor: CREAM,
      }}
    >
      {/* ── BACKGROUND SVG: panels + gold lines + border ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: 1123, height: 794, zIndex: 1, pointerEvents: 'none' }}
        viewBox="0 0 1123 794"
      >
        {/* Left navy panel */}
        <rect x="0" y="0" width="234" height="794" fill={NAVY}/>

        {/* Left panel upper facet — very subtle lighter wash */}
        <polygon points="234,0 234,200 100,340 0,260 0,0" fill="rgba(255,255,255,0.03)"/>

        {/* Left panel gold diagonal accent lines */}
        <line x1="234" y1="0"   x2="0"   y2="308" stroke={GOLD} strokeWidth="1.8"/>
        <line x1="234" y1="28"  x2="28"  y2="308" stroke={GOLD} strokeWidth="0.75" opacity="0.45"/>
        <line x1="234" y1="200" x2="100" y2="340" stroke={GOLD} strokeWidth="1.2"  opacity="0.55"/>
        <line x1="234" y1="218" x2="118" y2="346" stroke={GOLD} strokeWidth="0.6"  opacity="0.28"/>

        {/* Bottom-right dark corner (above footer y=742) */}
        <polygon points="868,742 1123,490 1123,742" fill={NAVY}/>

        {/* Bottom-right gold accent lines */}
        <line x1="868"  y1="742" x2="1123" y2="490" stroke={GOLD} strokeWidth="1.8"/>
        <line x1="894"  y1="742" x2="1123" y2="514" stroke={GOLD} strokeWidth="0.75" opacity="0.45"/>
        <line x1="856"  y1="742" x2="1075" y2="490" stroke={GOLD} strokeWidth="0.6"  opacity="0.28"/>

        {/* Thin gold border on cream area */}
        <rect x="240" y="8" width="875" height="778" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.3"/>
      </svg>

      {/* ── LOGO (on left panel) ── */}
      <div style={{
        position: 'absolute', top: 26, left: 18, zIndex: 8,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="46" height="33" viewBox="0 0 46 33">
          <path d="M3,26 C3,14 9,6 16,12 C21,17 21,21 23,21 C25,21 25,17 30,12 C37,6 43,14 43,26"
            stroke={TEAL} strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 15, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>Metabridge</span>
            <span style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 15, fontWeight: 300, color: '#FFFFFF', lineHeight: 1.2 }}>Academy</span>
          </div>
          <div style={{ fontSize: 6, color: TEAL, letterSpacing: '3.5px', textTransform: 'uppercase', marginTop: 3 }}>
            Learn · Build · Grow
          </div>
        </div>
      </div>

      {/* ── FEATURE BULLETS (bottom of left panel) ── */}
      <div style={{
        position: 'absolute', bottom: 68, left: 22, zIndex: 8,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {['Practical Skills', 'Real-World Projects', 'Expert Instructors', 'Global Opportunities'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 15, height: 1.5, background: GOLD, flexShrink: 0 }}/>
            <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.65)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500 }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* ── MOTTO (over dark bottom-right corner) ── */}
      <div style={{
        position: 'absolute', bottom: 60, right: 16, zIndex: 8,
        textAlign: 'right', width: 148,
      }}>
        <div style={{ fontSize: 8.5, color: 'rgba(248,250,252,0.55)', fontStyle: 'italic', lineHeight: 1.7 }}>
          Empowering People.<br/>Building Solutions.<br/>Creating Opportunities.
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 52,
        background: NAVY, zIndex: 10,
        display: 'flex', alignItems: 'center', padding: '0 26px', gap: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.7)', fontSize: 8.5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.5" ry="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          </svg>
          www.metabridgeacademy.com
        </div>
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)', margin: '0 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.7)', fontSize: 8.5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          0812 422 8730
        </div>
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)', margin: '0 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 8.5 }}>
          {/* Facebook */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
          {/* LinkedIn */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
          </svg>
          {/* X */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          {/* Instagram */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="rgba(255,255,255,0.7)"/>
          </svg>
          {/* YouTube */}
          <svg width="13" height="9" viewBox="0 0 28 20" fill="rgba(255,255,255,0.7)">
            <rect width="28" height="20" rx="4"/><polygon points="11,5 11,15 20,10" fill={NAVY}/>
          </svg>
          <span>MetabridgeA</span>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA (right of left panel, above footer) ── */}
      <div style={{
        position: 'absolute', top: 0, left: 234, right: 0, bottom: 52,
        zIndex: 5, display: 'flex',
      }}>
        {/* Globe watermark */}
        <svg style={{
          position: 'absolute', top: '50%', left: '46%',
          transform: 'translate(-50%,-50%)', opacity: 0.055,
          pointerEvents: 'none', width: 310, height: 310, zIndex: 0,
        }} viewBox="0 0 310 310">
          <circle cx="155" cy="155" r="150" fill="none" stroke="#0D1B2E" strokeWidth="1.2"/>
          <ellipse cx="155" cy="155" rx="72" ry="150" fill="none" stroke="#0D1B2E" strokeWidth="0.8"/>
          <ellipse cx="155" cy="155" rx="128" ry="150" fill="none" stroke="#0D1B2E" strokeWidth="0.8"/>
          <line x1="5" y1="155" x2="305" y2="155" stroke="#0D1B2E" strokeWidth="0.8"/>
          <ellipse cx="155" cy="155" rx="150" ry="52" fill="none" stroke="#0D1B2E" strokeWidth="0.6"/>
          <ellipse cx="155" cy="155" rx="150" ry="105" fill="none" stroke="#0D1B2E" strokeWidth="0.6"/>
          <line x1="155" y1="5" x2="155" y2="305" stroke="#0D1B2E" strokeWidth="0.6"/>
        </svg>

        {/* ── CENTER COLUMN ── */}
        <div style={{
          flex: 1, minWidth: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '16px 10px 10px 22px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* CERTIFICATE */}
          <div style={{
            fontFamily: 'var(--font-playfair),"Playfair Display",serif',
            fontSize: 64, fontWeight: 800, color: '#0D1B2E',
            letterSpacing: '9px', lineHeight: 1, textAlign: 'center',
          }}>
            CERTIFICATE
          </div>

          {/* — OF COMPLETION — */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0 14px' }}>
            <div style={{ flex: '0 0 70px', height: 1.5, background: GOLD }}/>
            <div style={{
              fontFamily: 'var(--font-playfair),"Playfair Display",serif',
              fontSize: 15, color: GOLD, letterSpacing: '7px',
              textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap',
            }}>
              {CERT_SUBTITLE[beltLevel]}
            </div>
            <div style={{ flex: '0 0 70px', height: 1.5, background: GOLD }}/>
          </div>

          {/* This is to certify that */}
          <div style={{ fontSize: 9, color: '#1A2B4A', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>
            This is to certify that
          </div>

          {/* Candidate name */}
          <div style={{
            fontFamily: 'var(--font-great-vibes),"Great Vibes",cursive',
            fontSize: 62, color: '#0D1B2E', lineHeight: 1.05, textAlign: 'center',
          }}>
            {candidateName || ' '}
          </div>

          {/* Name underline */}
          <div style={{
            width: 300, height: 1.5,
            background: `linear-gradient(to right, transparent, ${GOLD} 20%, ${GOLD} 80%, transparent)`,
            margin: '3px auto 10px',
          }}/>

          {/* has successfully completed */}
          <div style={{ fontSize: 12, color: '#1A2B4A', fontStyle: 'italic', marginBottom: 4 }}>
            has successfully completed the training programme in
          </div>

          {/* Course name */}
          <div style={{
            fontFamily: 'var(--font-playfair),"Playfair Display",serif',
            fontSize: 24, fontWeight: 700, color: '#0D1B2E',
            textAlign: 'center', lineHeight: 1.2, marginBottom: 2,
          }}>
            {courseName || ' '}
          </div>

          {/* AT METABRIDGE ACADEMY */}
          <div style={{ fontSize: 8.5, color: TEAL, letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 9 }}>
            at Metabridge Academy
          </div>

          {/* Description */}
          <div style={{ fontSize: 10.5, color: '#4A5568', textAlign: 'center', lineHeight: 1.65, maxWidth: 410 }}>
            {ACK}
          </div>

          {/* ── SIGNATURE ROW ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            gap: 20, width: '100%', marginTop: 'auto', paddingTop: 6,
          }}>
            {/* CEO */}
            <div style={{ textAlign: 'center', width: 148 }}>
              <div style={{ height: 46, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 5 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/signatures/ceo.png" alt="CEO signature"
                  style={{ width: 140, height: 46, objectFit: 'contain', objectPosition: 'bottom', display: 'block' }}/>
              </div>
              <div style={{ width: 130, height: 1, background: '#1A2B4A', margin: '0 auto 4px' }}/>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#0D1B2E', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Gideon Owhonda</div>
              <div style={{ fontSize: 8, color: '#4A5568', marginTop: 1, fontStyle: 'italic' }}>Founder &amp; Executive Director</div>
              <div style={{ fontSize: 8, color: '#4A5568', fontStyle: 'italic' }}>Metabridge Academy</div>
            </div>

            {/* SEAL */}
            <div style={{ flexShrink: 0, marginBottom: 2 }}>
              <svg width="116" height="116" viewBox="0 0 116 116">
                <circle cx="58" cy="58" r="55" fill={NAVY} stroke={GOLD} strokeWidth="7.5" strokeDasharray="5.5 2.5" transform="rotate(-90 58 58)"/>
                <circle cx="58" cy="58" r="47" fill="none" stroke={GOLD} strokeWidth="1.2"/>
                <circle cx="58" cy="58" r="45" fill={NAVY}/>
                <defs>
                  <path id="at" d="M58,58 m-36,0 a36,36 0 1,1 72,0"/>
                  <path id="ab" d="M58,58 m-28,0 a28,28 0 0,0 56,0"/>
                </defs>
                <text fontSize="6.2" fontFamily="Inter,sans-serif" fill="rgba(248,248,240,0.88)" letterSpacing="1.2" fontWeight="600">
                  <textPath href="#at" startOffset="4%">METABRIDGE ACADEMY</textPath>
                </text>
                <path d="M36,72 C36,60 42,53 48,59 C53,64 53,67 58,67 C63,67 63,64 68,59 C74,53 80,60 80,72"
                  stroke={TEAL} strokeWidth="4.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="58" y="91" textAnchor="middle" fontSize="9" fill={GOLD}>★ ★ ★</text>
              </svg>
            </div>

            {/* Lead Instructor */}
            <div style={{ textAlign: 'center', width: 148 }}>
              <div style={{ height: 46, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 5 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/signatures/instructor.png" alt="Lead Instructor signature"
                  style={{ width: 140, height: 46, objectFit: 'contain', objectPosition: 'bottom', display: 'block' }}/>
              </div>
              <div style={{ width: 130, height: 1, background: '#1A2B4A', margin: '0 auto 4px' }}/>
              <div style={{ fontSize: 7.5, fontWeight: 700, color: '#0D1B2E', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Bright G.O</div>
              <div style={{ fontSize: 8, color: '#4A5568', marginTop: 1, fontStyle: 'italic' }}>Lead Instructor</div>
              <div style={{ fontSize: 8, color: '#4A5568', fontStyle: 'italic' }}>Metabridge Academy</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT INFO COLUMN (on cream) ── */}
        <div style={{
          width: 186, flexShrink: 0,
          padding: '20px 18px 0 10px',
          position: 'relative',
        }}>
          {certificateCode && (
            <div style={{ marginTop: 13 }}>
              <div style={{ fontSize: 6, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#888', fontWeight: 600, marginBottom: 3 }}>Certificate ID</div>
              <div style={{ fontSize: 10, color: '#0D1B2E', fontWeight: 600, letterSpacing: '0.3px', wordBreak: 'break-all' }}>
                {certificateCode}
              </div>
              <div style={{ width: 20, height: 1.5, background: GOLD, marginTop: 10 }}/>
            </div>
          )}

          {dateIssued && (
            <div style={{ marginTop: 13 }}>
              <div style={{ fontSize: 6, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#888', fontWeight: 600, marginBottom: 3 }}>Date of Completion</div>
              <div style={{ fontSize: 10, color: '#0D1B2E', fontWeight: 600 }}>{dateIssued}</div>
              <div style={{ width: 20, height: 1.5, background: GOLD, marginTop: 10 }}/>
            </div>
          )}

          {qrDataUrl && (
            <div style={{ marginTop: 14, textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="Scan to verify"
                style={{ width: 82, height: 82, display: 'block', margin: '0 auto', border: '1px solid rgba(27,42,74,0.18)' }}/>
              <div style={{ fontSize: 7.5, color: '#666', letterSpacing: '0.5px', marginTop: 5 }}>Scan to Verify</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
