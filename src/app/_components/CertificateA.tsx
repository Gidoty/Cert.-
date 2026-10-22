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

const NAVY = '#0D1B2E';
const GOLD = '#C9A84C';
const TEAL = '#2B8A9C';
const CREAM = '#F4F5F0';

const CERT_SUBTITLE: Record<BeltLevel, string> = {
  'Green Belt': 'OF COMPLETION',
  'Blue Belt':  'OF ACHIEVEMENT',
  'Black Belt': 'OF MASTERY',
};

const BELT_LABEL: Record<BeltLevel, string> = {
  'Green Belt': 'Green Belt · Foundation',
  'Blue Belt':  'Blue Belt · Professional',
  'Black Belt': 'Black Belt · Mastery',
};

const ACK = 'In recognition of demonstrated technical competence, practical excellence, and commitment to building future-ready capabilities through digital technology.';

const GlobeWatermark = () => (
  <svg width="400" height="400" viewBox="0 0 400 400">
    <circle cx="200" cy="200" r="190" fill="none" stroke={NAVY} strokeWidth="1.5"/>
    {[-120, -60, 0, 60, 120].map((dy, i) => {
      const rx = Math.sqrt(Math.max(0, 190 * 190 - dy * dy));
      return rx > 0 ? (
        <ellipse key={i} cx="200" cy={200 + dy} rx={rx} ry={rx * 0.38}
          fill="none" stroke={NAVY} strokeWidth="1"/>
      ) : null;
    })}
    {[0, 30, 60, 90, 120, 150].map((angle, i) => (
      <ellipse key={i} cx="200" cy="200"
        rx={190 * Math.abs(Math.cos(angle * Math.PI / 180)) || 1} ry="190"
        transform={`rotate(${angle} 200 200)`}
        fill="none" stroke={NAVY} strokeWidth="1"/>
    ))}
  </svg>
);

const GoldSeal = () => (
  <svg width="100" height="100" viewBox="0 0 200 200" style={{ display: 'block' }}>
    <circle cx="100" cy="100" r="92" fill={NAVY} stroke={GOLD} strokeWidth="2.5"/>
    <circle cx="100" cy="100" r="82" fill="none" stroke={GOLD} strokeWidth="0.7" strokeDasharray="3 2"/>
    {Array.from({ length: 36 }).map((_, i) => {
      const a = i * 10 * Math.PI / 180;
      return (
        <line key={i}
          x1={100 + 87 * Math.cos(a)} y1={100 + 87 * Math.sin(a)}
          x2={100 + 92 * Math.cos(a)} y2={100 + 92 * Math.sin(a)}
          stroke={GOLD} strokeWidth="1.5"/>
      );
    })}
    <defs>
      <path id="gst" d="M100,100 m-72,0 a72,72 0 1,1 144,0"/>
      <path id="gsb" d="M100,100 m-62,0 a62,62 0 0,0 124,0"/>
    </defs>
    <text fontSize="8.5" fontFamily="Georgia,serif" fill={GOLD} letterSpacing="2.5">
      <textPath href="#gst" startOffset="6%">METABRIDGE ACADEMY · PORT HARCOURT</textPath>
    </text>
    <text fontSize="7.5" fontFamily="Georgia,serif" fill={GOLD} letterSpacing="2.5">
      <textPath href="#gsb" startOffset="14%">LEARN · BUILD · GROW</textPath>
    </text>
    <path d="M68 110 L80 76 L91 97 L100 80 L109 97 L120 76 L132 110"
      fill="none" stroke="#2BC8D4" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="100" y="146" textAnchor="middle" fontSize="18" fill={GOLD} fontFamily="serif">★ ★ ★</text>
  </svg>
);

const LEFT = 234;
const RIGHT = 186;
const CW = 1123 - LEFT - RIGHT; // 703

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
      {/* Gold outer border */}
      <div style={{ position: 'absolute', inset: 5, border: `1.5px solid ${GOLD}`, pointerEvents: 'none', zIndex: 15, opacity: 0.7 }}/>

      {/* ═══ LEFT PANEL ═══ */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: LEFT, height: 794,
        backgroundColor: NAVY, overflow: 'hidden',
      }}>
        {/* Gold diagonal accent lines */}
        <svg width={LEFT} height={794} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <line x1="-20" y1="200" x2={LEFT + 20} y2="155" stroke={GOLD} strokeWidth="0.8" opacity="0.4"/>
          <line x1="-20" y1="208" x2={LEFT + 20} y2="163" stroke={GOLD} strokeWidth="0.4" opacity="0.2"/>
          <line x1="-20" y1="636" x2={LEFT + 20} y2="590" stroke={GOLD} strokeWidth="0.8" opacity="0.4"/>
          <line x1="-20" y1="644" x2={LEFT + 20} y2="598" stroke={GOLD} strokeWidth="0.4" opacity="0.2"/>
          <circle cx={LEFT * 0.5} cy={280} r="58" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.08"/>
        </svg>

        {/* ── Logo zone (white background) ── */}
        <div style={{
          position: 'relative', zIndex: 2,
          background: '#FFFFFF',
          width: '100%', height: 96,
          overflow: 'hidden',
          borderBottom: `2px solid ${GOLD}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Metabridge Academy"
            style={{
              width: 210,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Belt badge */}
        <div style={{
          position: 'relative', zIndex: 2, margin: '16px 18px 0',
          background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.4)`,
          borderRadius: 3, padding: '6px 10px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 7.5, color: GOLD, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700 }}>
            {BELT_LABEL[beltLevel]}
          </div>
        </div>

        {/* Feature bullets — bottom of left panel */}
        <div style={{ position: 'absolute', bottom: 68, left: 18, right: 18, zIndex: 2 }}>
          <div style={{ height: '0.5px', background: `linear-gradient(to right, ${GOLD}, transparent)`, opacity: 0.4, marginBottom: 14 }}/>
          {['Practical Skills', 'Real-World Projects', 'Expert Instructors', 'Global Opportunities'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <svg width="8" height="8" viewBox="0 0 8 8" style={{ flexShrink: 0 }}>
                <polygon points="4,0 8,4 4,8 0,4" fill={GOLD}/>
              </svg>
              <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.3px' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{
        position: 'absolute', right: 0, top: 0, width: RIGHT, height: 794,
        backgroundColor: '#0A1726',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 14px 70px', overflow: 'hidden',
      }}>
        <svg width={RIGHT} height={794} style={{ position: 'absolute', inset: 0 }}>
          <line x1="-10" y1="96" x2={RIGHT + 10} y2="70" stroke={GOLD} strokeWidth="0.7" opacity="0.3"/>
          <line x1="-10" y1="640" x2={RIGHT + 10} y2="614" stroke={GOLD} strokeWidth="0.7" opacity="0.3"/>
        </svg>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: 6.5, color: GOLD, letterSpacing: '1.5px', textTransform: 'uppercase', lineHeight: 1.9, textAlign: 'center' }}>
            Global Skills<br/>For A Brighter<br/>Tomorrow
          </div>
          <div style={{ height: '0.5px', background: GOLD, opacity: 0.3, margin: '12px 10px' }}/>
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', marginTop: 'auto' }}>
          {certificateCode && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 3 }}>Certificate ID</div>
              <div style={{ fontFamily: 'Courier,monospace', fontSize: 8.5, color: GOLD, letterSpacing: '1px', wordBreak: 'break-all', lineHeight: 1.6 }}>
                {certificateCode}
              </div>
            </div>
          )}
          {dateIssued && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 3 }}>Date Issued</div>
              <div style={{ fontSize: 9, color: '#FFFFFF', letterSpacing: '0.3px' }}>{dateIssued}</div>
            </div>
          )}
          {studentId && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 3 }}>Student ID</div>
              <div style={{ fontFamily: 'Courier,monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>{studentId}</div>
            </div>
          )}
          {qrDataUrl && (
            <div style={{ textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="Scan to verify"
                style={{ width: 68, height: 68, display: 'block', margin: '0 auto', border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 2 }}/>
              <div style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.3)', marginTop: 3, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Scan to verify
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ CENTER AREA ═══ */}
      <div style={{
        position: 'absolute', left: LEFT, top: 0,
        width: CW, height: 794,
        backgroundColor: CREAM, overflow: 'hidden',
      }}>
        {/* Globe watermark */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
          <GlobeWatermark/>
        </div>

        {/* Bottom-right dark triangle */}
        <svg width={CW} height={794} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          <polygon points={`${CW - 120},742 ${CW},460 ${CW},742`} fill={NAVY} opacity="0.88"/>
        </svg>

        {/* Center content */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center',
          height: '100%', padding: '22px 36px 68px',
        }}>

          {/* CERTIFICATE heading */}
          <div style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 60, fontWeight: 800,
            color: NAVY, letterSpacing: '10px', lineHeight: 1,
            textTransform: 'uppercase', marginBottom: 2,
          }}>
            CERTIFICATE
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 10.5, color: GOLD, letterSpacing: '6px',
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 10,
          }}>
            — {CERT_SUBTITLE[beltLevel]} —
          </div>

          {/* Gold rule */}
          <div style={{ width: 180, height: 1, background: GOLD, margin: '0 auto 12px', opacity: 0.55 }}/>

          {/* This is to certify */}
          <div style={{ fontSize: 9.5, color: 'rgba(13,27,46,0.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4, fontStyle: 'italic' }}>
            This is to certify that
          </div>

          {/* Candidate name in Great Vibes script */}
          <div style={{
            fontFamily: 'var(--font-great-vibes), "Great Vibes", cursive',
            fontSize: 58, color: NAVY, lineHeight: 1.25, minHeight: 70,
          }}>
            {candidateName || ' '}
          </div>

          {/* Name underline */}
          <div style={{ width: 240, height: 1.5, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, margin: '2px auto 8px' }}/>

          {/* has successfully completed */}
          <div style={{ fontSize: 9.5, color: 'rgba(13,27,46,0.5)', fontStyle: 'italic', marginBottom: 3 }}>
            has successfully completed the
          </div>

          {/* Course */}
          <div style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 19, fontWeight: 700, color: '#B5621A', lineHeight: 1.3, marginBottom: 1,
          }}>
            {courseName || ' '}
          </div>

          {/* At Metabridge Academy */}
          <div style={{ fontSize: 9, color: TEAL, letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
            at Metabridge Academy
          </div>

          {/* Acknowledgment */}
          <div style={{
            fontSize: 8.5, color: 'rgba(13,27,46,0.45)', fontStyle: 'italic',
            maxWidth: 470, lineHeight: 1.75, margin: '0 auto 14px',
            padding: '7px 12px',
            borderTop: `0.5px solid rgba(201,168,76,0.35)`,
            borderBottom: `0.5px solid rgba(201,168,76,0.35)`,
          }}>
            {ACK}
          </div>

          {/* Signature row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            width: '100%', maxWidth: 540, margin: '0 auto',
          }}>
            {/* CEO */}
            <div style={{ textAlign: 'center', width: 145 }}>
              <div style={{ height: 42, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/signatures/ceo.png" alt="CEO signature"
                  style={{ width: 135, height: 42, objectFit: 'contain', objectPosition: 'bottom', display: 'block' }}/>
              </div>
              <div style={{ width: 135, height: 0.8, background: `linear-gradient(to right, transparent, rgba(13,27,46,0.4), transparent)`, margin: '0 auto 3px' }}/>
              <div style={{ fontSize: 9, fontWeight: 700, color: NAVY, letterSpacing: '0.2px' }}>Gideon Owhonda</div>
              <div style={{ fontSize: 7, color: 'rgba(13,27,46,0.5)', marginTop: 1 }}>CEO, Metabridge Academy</div>
            </div>

            {/* Gold Seal */}
            <div style={{ flexShrink: 0 }}>
              <GoldSeal/>
            </div>

            {/* Lead Instructor */}
            <div style={{ textAlign: 'center', width: 145 }}>
              <div style={{ height: 42, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 3 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/signatures/instructor.png" alt="Lead Instructor signature"
                  style={{ width: 135, height: 42, objectFit: 'contain', objectPosition: 'bottom', display: 'block' }}/>
              </div>
              <div style={{ width: 135, height: 0.8, background: `linear-gradient(to right, transparent, rgba(13,27,46,0.4), transparent)`, margin: '0 auto 3px' }}/>
              <div style={{ fontSize: 9, fontWeight: 700, color: NAVY, letterSpacing: '0.2px' }}>Bright G.O</div>
              <div style={{ fontSize: 7, color: 'rgba(13,27,46,0.5)', marginTop: 1 }}>Lead Instructor</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER BAR ═══ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 52,
        backgroundColor: NAVY, zIndex: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
        borderTop: `1px solid rgba(201,168,76,0.25)`,
      }}>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.45)', letterSpacing: '1px' }}>
          www.metabridgeacademy.com
        </div>
        <div style={{ fontSize: 7.5, color: GOLD, letterSpacing: '3px', textTransform: 'uppercase' }}>
          Port Harcourt · Nigeria
        </div>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px' }}>
          info@metabridgeacademy.com
        </div>
      </div>
    </div>
  );
}
