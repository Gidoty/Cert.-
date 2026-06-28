'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

interface CertificateAProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  divRef?: RefObject<HTMLDivElement>;
}

// Subtle dot-grid background for the body (tech aesthetic)
const DotGrid = () => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="dotgrid-a" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="14" cy="14" r="1.2" fill="#1B2A4A" opacity="0.08" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dotgrid-a)" />
  </svg>
);

// Thin circuit-trace lines in lower-right corner
const CircuitCorner = () => (
  <svg
    width="120"
    height="90"
    viewBox="0 0 120 90"
    style={{ position: 'absolute', bottom: 8, right: 8, opacity: 0.12, zIndex: 2 }}
  >
    <line x1="0" y1="70" x2="60" y2="70" stroke="#29B6D8" strokeWidth="1" />
    <line x1="60" y1="70" x2="60" y2="30" stroke="#29B6D8" strokeWidth="1" />
    <line x1="60" y1="30" x2="120" y2="30" stroke="#29B6D8" strokeWidth="1" />
    <circle cx="60" cy="70" r="3" fill="#29B6D8" />
    <circle cx="60" cy="30" r="3" fill="#29B6D8" />
    <line x1="20" y1="90" x2="20" y2="50" stroke="#29B6D8" strokeWidth="1" />
    <line x1="20" y1="50" x2="90" y2="50" stroke="#29B6D8" strokeWidth="1" />
    <circle cx="20" cy="50" r="2" fill="#29B6D8" />
    <circle cx="90" cy="50" r="2" fill="#29B6D8" />
  </svg>
);

export default function CertificateA({
  candidateName,
  courseName,
  dateIssued,
  certificateCode,
  divRef,
}: CertificateAProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!certificateCode) return;
    QRCode.toDataURL(
      `${window.location.origin}/verify/${certificateCode}`,
      {
        margin: 1,
        width: 100,
        color: { dark: '#0D1B35', light: '#F7FAFC' },
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
        backgroundColor: '#F7FAFC',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
      {/* ── Dot-grid background ── */}
      <DotGrid />

      {/* ── Cyan left accent bar ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 7,
          background: 'linear-gradient(to bottom, #29B6D8, #1E6B7A)',
          zIndex: 10,
        }}
      />

      {/* ── Header band ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          background: 'linear-gradient(135deg, #0D1B35 0%, #1B2A4A 60%, #1E4A6B 100%)',
          zIndex: 3,
        }}
      >
        {/* Subtle cyan sheen on right side */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(to left, rgba(41,182,216,0.08) 0%, transparent 100%)',
          }}
        />

        {/* Cyan underline rule at bottom of header */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 7,
            right: 0,
            height: 2,
            background: 'linear-gradient(to right, #29B6D8, #00D4FF, transparent)',
          }}
        />

        {/* Header text — centred */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            Gateway to Digital Literacy
          </div>
          <div
            style={{
              width: 200,
              height: 1,
              background: 'linear-gradient(to right, transparent, #29B6D8, transparent)',
              margin: '10px 0',
              opacity: 0.7,
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: '#29B6D8',
              fontWeight: 700,
              letterSpacing: '5px',
              textTransform: 'uppercase',
            }}
          >
            Certificate of Completion
          </div>
        </div>

        {/* Certificate code — top right inside header */}
        {certificateCode && (
          <div
            style={{
              position: 'absolute',
              top: 85,
              right: 24,
              color: 'rgba(255,255,255,0.75)',
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
          inset: 8,
          border: '2px solid #1B2A4A',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* ── Inner cyan accent border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 13,
          border: '1px solid rgba(41,182,216,0.3)',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* ── Circuit corner decoration ── */}
      <CircuitCorner />

      {/* ── Body content ── */}
      <div
        style={{
          position: 'absolute',
          top: HEADER_H,
          left: 7,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '30px 70px 18px',
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
              marginBottom: 14,
              letterSpacing: '0.5px',
            }}
          >
            This is to certify that
          </div>

          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 44,
              fontWeight: 700,
              color: '#0D1B35',
              lineHeight: 1.2,
              minHeight: 58,
            }}
          >
            {candidateName || ' '}
          </div>

          {/* Cyan rule under name */}
          <div
            style={{
              width: 120,
              height: 2,
              background: 'linear-gradient(to right, #29B6D8, #00D4FF)',
              margin: '12px auto 14px',
              borderRadius: 1,
            }}
          />

          <div
            style={{
              fontSize: 13,
              color: '#1E6B7A',
              fontStyle: 'italic',
              marginBottom: 8,
            }}
          >
            has successfully completed the
          </div>

          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#1B2A4A',
              marginBottom: 4,
            }}
          >
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 12, color: '#2B8A9C' }}>
            training programme conducted by Metabridge Academy
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: '#1E6B7A' }}>
              Issued: {dateIssued || ' '}
            </div>
          </div>
        </div>

        {/* Signature */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid rgba(41,182,216,0.35)',
            paddingTop: 14,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
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

      {/* ── QR CODE ── */}
      {qrDataUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 22,
            textAlign: 'center',
            zIndex: 7,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Scan to verify"
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
