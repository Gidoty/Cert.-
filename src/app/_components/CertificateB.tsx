'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

const BRIGHT_SIG_B64 = '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';
const GIDEON_SIG_B64 = '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';

interface CertificateBProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  divRef?: RefObject<HTMLDivElement>;
}

// Diagonal "METABRIDGE ACADEMY" watermark
const Watermark = ({ id }: { id: string }) => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id={id} x="0" y="0" width="320" height="130" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
        <text x="10" y="55" fontSize="13" fontFamily="Inter, Arial, sans-serif" fontWeight="700"
          fill="#1B2A4A" opacity="0.055" letterSpacing="5">
          METABRIDGE ACADEMY
        </text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

// Hex-grid background for body — more tech than dots
const HexGrid = () => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="hexgrid-b" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
        <polygon
          points="20,2 38,12 38,34 20,44 2,34 2,12"
          fill="none"
          stroke="#1B2A4A"
          strokeWidth="0.6"
          opacity="0.07"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexgrid-b)" />
  </svg>
);

// Gold corner node ornament
const CornerNode = () => (
  <svg width="22" height="22" viewBox="0 0 22 22">
    <circle cx="11" cy="11" r="5" fill="#C9A84C" />
    <circle cx="11" cy="11" r="8" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.4" />
    <line x1="11" y1="0" x2="11" y2="4" stroke="#C9A84C" strokeWidth="1.5" />
    <line x1="11" y1="18" x2="11" y2="22" stroke="#C9A84C" strokeWidth="1.5" />
    <line x1="0" y1="11" x2="4" y2="11" stroke="#C9A84C" strokeWidth="1.5" />
    <line x1="18" y1="11" x2="22" y2="11" stroke="#C9A84C" strokeWidth="1.5" />
  </svg>
);

const SmallDiamond = ({ size = 10, color = '#29B6D8' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'inline-block' }}>
    <polygon points="10,0 20,10 10,20 0,10" fill={color} />
  </svg>
);

const AcademySeal = ({ id }: { id: string }) => (
  <svg width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id={id} d="M 42,42 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
    </defs>
    <circle cx="42" cy="42" r="41" fill="rgba(27,42,74,0.06)" />
    <circle cx="42" cy="42" r="41" fill="none" stroke="#1B2A4A" strokeWidth="2.5" />
    <circle cx="42" cy="42" r="36.5" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.85" />
    <text fontSize="6.2" fill="#1B2A4A" fontFamily="Inter, Arial, sans-serif" fontWeight="700" letterSpacing="2.2">
      <textPath href={`#${id}`} startOffset="3%">METABRIDGE ACADEMY • CERTIFIED •</textPath>
    </text>
    <circle cx="42" cy="42" r="25" fill="none" stroke="#1B2A4A" strokeWidth="1" />
    <line x1="42" y1="17" x2="42" y2="21" stroke="#C9A84C" strokeWidth="2" />
    <line x1="42" y1="63" x2="42" y2="67" stroke="#C9A84C" strokeWidth="2" />
    <line x1="17" y1="42" x2="21" y2="42" stroke="#C9A84C" strokeWidth="2" />
    <line x1="63" y1="42" x2="67" y2="42" stroke="#C9A84C" strokeWidth="2" />
    <polygon points="42,23 52,28.5 52,39.5 42,45 32,39.5 32,28.5" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
    <text x="42" y="37" textAnchor="middle" fontSize="11" fontFamily="'Playfair Display', serif" fontWeight="700" fill="#1B2A4A">MA</text>
    <line x1="30" y1="50" x2="54" y2="50" stroke="#C9A84C" strokeWidth="0.8" opacity="0.7" />
    <text x="42" y="58" textAnchor="middle" fontSize="4.5" fontFamily="Inter, Arial, sans-serif" fill="#1B2A4A" letterSpacing="0.5" fontWeight="600">DIGITAL LITERACY</text>
  </svg>
);

export default function CertificateB({
  candidateName,
  courseName,
  dateIssued,
  certificateCode,
  divRef,
}: CertificateBProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!certificateCode) return;
    QRCode.toDataURL(
      `${window.location.origin}/verify/${certificateCode}`,
      {
        margin: 1,
        width: 100,
        color: { dark: '#0D1B35', light: '#ECF3F7' },
      }
    ).then((url) => setQrDataUrl(url));
  }, [certificateCode]);

  const HEADER_H = 159;

  return (
    <div
      ref={divRef}
      style={{
        width: 1122,
        height: 793,
        backgroundColor: '#ECF3F7',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
      {/* ── Watermark ── */}
      <Watermark id="wm-b" />

      {/* ── Hex-grid background ── */}
      <HexGrid />

      {/* ── Header band ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          background: 'linear-gradient(135deg, #0D1B35 0%, #1B2A4A 55%, #1E4A6B 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
        }}
      >
        {/* Cyan sheen right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '35%',
            height: '100%',
            background: 'linear-gradient(to left, rgba(41,182,216,0.1) 0%, transparent 100%)',
          }}
        />

        {/* Bottom cyan rule */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(to right, transparent, #29B6D8, #00D4FF, transparent)',
          }}
        />

        {/* Small node icon above title */}
        <div style={{ marginBottom: 6 }}>
          <SmallDiamond size={12} color="#29B6D8" />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 34,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '1px',
            lineHeight: 1.2,
          }}
        >
          Metabridge Academy
        </div>

        <div
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          Gateway to Digital Literacy
        </div>

        {/* Decorative divider with gold diamond */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: '10px 0',
            width: 260,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'linear-gradient(to right, transparent, #29B6D8)',
            }}
          />
          <SmallDiamond size={7} color="#C9A84C" />
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'linear-gradient(to left, transparent, #29B6D8)',
            }}
          />
        </div>

        {/* Crimson badge for certificate type */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#8B1A1A', borderRadius: 2, padding: '4px 14px', marginTop: 6,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C' }} />
          <span style={{ fontSize: 10, color: '#FFFFFF', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>
            Certificate of Achievement
          </span>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C' }} />
        </div>

        {/* Certificate code — top right inside header */}
        {certificateCode && (
          <div
            style={{
              position: 'absolute',
              top: 93,
              right: 24,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'Courier, monospace',
              fontSize: 11,
              letterSpacing: '1px',
              textAlign: 'right',
            }}
          >
            {certificateCode}
          </div>
        )}
      </div>

      {/* ── Outer navy border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 7,
          border: '3px solid #1B2A4A',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Gold mid border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 13,
          border: '1.5px solid rgba(201,168,76,0.6)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Cyan inner border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 19,
          border: '1px solid rgba(41,182,216,0.2)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Corner node ornaments ── */}
      <div style={{ position: 'absolute', top: -1, left: -1, zIndex: 8 }}>
        <CornerNode />
      </div>
      <div style={{ position: 'absolute', top: -1, right: -1, zIndex: 8 }}>
        <CornerNode />
      </div>
      <div style={{ position: 'absolute', bottom: -1, left: -1, zIndex: 8 }}>
        <CornerNode />
      </div>
      <div style={{ position: 'absolute', bottom: -1, right: -1, zIndex: 8 }}>
        <CornerNode />
      </div>

      {/* ── Body content ── */}
      <div
        style={{
          position: 'absolute',
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 90px 18px',
          zIndex: 4,
        }}
      >
        {/* Central text */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: '#1E6B7A',
              fontStyle: 'italic',
              marginBottom: 12,
              letterSpacing: '0.5px',
            }}
          >
            Awarded to
          </div>

          {/* Candidate name */}
          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 46,
              fontWeight: 700,
              color: '#0D1B35',
              lineHeight: 1.2,
              minHeight: 65,
            }}
          >
            {candidateName || ' '}
          </div>

          {/* Gold rule under name */}
          <div
            style={{
              width: 150,
              height: 2,
              background: 'linear-gradient(to right, #C9A84C, #E8C96A, #C9A84C)',
              margin: '12px auto 16px',
              borderRadius: 1,
            }}
          />

          <div
            style={{
              fontSize: 13,
              color: '#1E6B7A',
              fontStyle: 'italic',
              marginBottom: 8,
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            In recognition of dedicated commitment and successful completion of the
          </div>

          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 24,
              fontWeight: 700,
              color: '#1B2A4A',
              marginBottom: 6,
            }}
          >
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 12, color: '#2B8A9C' }}>
            certification programme at Metabridge Academy
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#1E6B7A' }}>
              Issued: {dateIssued || ' '}
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid rgba(201,168,76,0.4)',
            paddingTop: 14,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${GIDEON_SIG_B64}`}
              alt=""
              style={{
                width: 120,
                height: 'auto',
                display: 'block',
                margin: '0 auto 2px',
              }}
            />
            <div
              style={{
                width: 140,
                borderBottom: '1px solid #1B2A4A',
                margin: '0 auto 6px',
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B35' }}>
              Gideon Owhonda
            </div>
            <div style={{ fontSize: 11, color: '#2B8A9C' }}>
              Founder &amp; CEO, Metabridge Academy
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${BRIGHT_SIG_B64}`}
              alt=""
              style={{
                width: 120,
                height: 'auto',
                display: 'block',
                margin: '0 auto 2px',
              }}
            />
            <div
              style={{
                width: 140,
                borderBottom: '1px solid #1B2A4A',
                margin: '0 auto 6px',
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B35' }}>
              Bright G. O
            </div>
            <div style={{ fontSize: 11, color: '#2B8A9C' }}>
              Lead Instructor, Metabridge Academy
            </div>
          </div>
        </div>
      </div>

      {/* ── ACADEMY SEAL ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 22,
          left: 26,
          textAlign: 'center',
          zIndex: 7,
        }}
      >
        <AcademySeal id="seal-b" />
        <div style={{ fontSize: 8, color: '#2B8A9C', marginTop: 2 }}>
          Official Seal
        </div>
      </div>

      {/* ── QR CODE ── */}
      {qrDataUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            right: 26,
            textAlign: 'center',
            zIndex: 7,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Scan to verify authenticity"
            style={{ width: 68, height: 68, display: 'block' }}
          />
          <div style={{ fontSize: 8, color: '#2B8A9C', marginTop: 2 }}>
            Scan to verify
          </div>
        </div>
      )}
    </div>
  );
}
