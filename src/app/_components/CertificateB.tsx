'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

interface CertificateBProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  divRef?: RefObject<HTMLDivElement>;
}

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

// Cyan corner node ornament (replaces old gold diamond)
const CornerNode = () => (
  <svg width="22" height="22" viewBox="0 0 22 22">
    <circle cx="11" cy="11" r="5" fill="#29B6D8" />
    <circle cx="11" cy="11" r="8" fill="none" stroke="#29B6D8" strokeWidth="1.5" opacity="0.4" />
    <line x1="11" y1="0" x2="11" y2="4" stroke="#29B6D8" strokeWidth="1.5" />
    <line x1="11" y1="18" x2="11" y2="22" stroke="#29B6D8" strokeWidth="1.5" />
    <line x1="0" y1="11" x2="4" y2="11" stroke="#29B6D8" strokeWidth="1.5" />
    <line x1="18" y1="11" x2="22" y2="11" stroke="#29B6D8" strokeWidth="1.5" />
  </svg>
);

const SmallDiamond = ({ size = 10, color = '#29B6D8' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'inline-block' }}>
    <polygon points="10,0 20,10 10,20 0,10" fill={color} />
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
        color: { dark: '#0D1B35', light: '#F0F8FA' },
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
        backgroundColor: '#F0F8FA',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
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

        {/* Decorative divider */}
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
          <SmallDiamond size={7} color="#29B6D8" />
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'linear-gradient(to left, transparent, #29B6D8)',
            }}
          />
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#29B6D8',
            fontWeight: 700,
            letterSpacing: '5px',
            textTransform: 'uppercase',
          }}
        >
          Certificate of Achievement
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
          inset: 8,
          border: '3px solid #1B2A4A',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Inner cyan border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 15,
          border: '1.5px solid rgba(41,182,216,0.45)',
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

          {/* Cyan rule under name */}
          <div
            style={{
              width: 150,
              height: 2,
              background: 'linear-gradient(to right, #29B6D8, #00D4FF)',
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
            borderTop: '1px solid rgba(41,182,216,0.35)',
            paddingTop: 14,
            display: 'flex',
            justifyContent: 'space-around',
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
              Gideon Owhonda
            </div>
            <div style={{ fontSize: 11, color: '#2B8A9C' }}>
              Founder &amp; CEO, Metabridge Academy
            </div>
          </div>

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
