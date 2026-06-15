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

const DiamondSVG = ({ size = 14, color = '#F4891F' }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} style={{ display: 'inline-block' }}>
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
      `https://metabridgeacademy.com/verify/${certificateCode}`,
      {
        margin: 1,
        width: 100,
        color: { dark: '#1B2A4A', light: '#FFFFFF' },
      }
    ).then((url) => setQrDataUrl(url));
  }, [certificateCode]);
  return (
    <div
      ref={divRef}
      style={{
        width: 1122,
        height: 793,
        backgroundColor: '#F7F9FC',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
      {/* ── Corner diamond ornaments ── */}
      {/* Top-left */}
      <div style={{ position: 'absolute', top: 12, left: 12, transform: 'rotate(45deg)', width: 16, height: 16, backgroundColor: '#F4891F' }} />
      {/* Top-right */}
      <div style={{ position: 'absolute', top: 12, right: 12, transform: 'rotate(45deg)', width: 16, height: 16, backgroundColor: '#F4891F' }} />
      {/* Bottom-left */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, transform: 'rotate(45deg)', width: 16, height: 16, backgroundColor: '#F4891F' }} />
      {/* Bottom-right */}
      <div style={{ position: 'absolute', bottom: 12, right: 12, transform: 'rotate(45deg)', width: 16, height: 16, backgroundColor: '#F4891F' }} />

      {/* ── Outer border (navy, 3px) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 8,
          border: '3px solid #1B2A4A',
          pointerEvents: 'none',
        }}
      />

      {/* ── Inner border (orange, 1.5px) — 6px gap from outer ── */}
      <div
        style={{
          position: 'absolute',
          inset: 17,
          border: '1.5px solid #F4891F',
          pointerEvents: 'none',
        }}
      />

      {/* ── Main content area ── */}
      <div
        style={{
          position: 'absolute',
          inset: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          {/* Diamond ornament */}
          <div style={{ marginBottom: 8 }}>
            <DiamondSVG size={18} color="#F4891F" />
          </div>

          {/* Academy name */}
          <div
            style={{
              fontSize: 12,
              color: '#F4891F',
              fontWeight: 800,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Metabridge Academy
          </div>

          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 3 }}>
            Port Harcourt
          </div>

          {/* Decorative divider with center diamond */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              margin: '10px auto',
              width: 300,
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: '#1B2A4A' }} />
            <DiamondSVG size={10} color="#1B2A4A" />
            <div style={{ flex: 1, height: 1, backgroundColor: '#1B2A4A' }} />
          </div>

          {/* Certificate type */}
          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 20,
              fontWeight: 700,
              color: '#1B2A4A',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Certificate of Achievement
          </div>
        </div>

        {/* ── BODY ── */}
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
          <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginBottom: 8 }}>
            Awarded to
          </div>

          {/* Candidate name — centerpiece */}
          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 44,
              fontWeight: 700,
              color: '#1B2A4A',
              lineHeight: 1.2,
              minHeight: 60,
            }}
          >
            {candidateName || ' '}
          </div>

          {/* Decorative underline */}
          <div
            style={{
              width: 140,
              height: 2,
              backgroundColor: '#F4891F',
              margin: '8px auto 14px',
            }}
          />

          <div
            style={{
              fontSize: 12,
              color: '#4B5563',
              fontStyle: 'italic',
              maxWidth: 600,
            }}
          >
            In recognition of dedicated commitment and successful completion of the
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#1B2A4A',
              marginTop: 6,
            }}
          >
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
            certification programme at Metabridge Academy
          </div>

          {/* Thin rule + date + code */}
          <div style={{ marginTop: 16, width: '60%', textAlign: 'center' }}>
            <div style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 10 }} />
            <div style={{ fontSize: 12, color: '#1B2A4A' }}>
              Issued: {dateIssued || ' '}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#6B7280',
                fontFamily: 'Courier, monospace',
                marginTop: 4,
                letterSpacing: '1px',
              }}
            >
              {certificateCode || ' '}
            </div>
          </div>
        </div>

        {/* ── SIGNATURES ── */}
        <div
          style={{
            width: '100%',
            paddingTop: 16,
            paddingBottom: 20,
            display: 'flex',
            justifyContent: 'space-around',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          {/* Left signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#1B2A4A', fontFamily: 'cursive', marginBottom: 2, letterSpacing: '2px' }}>
              _______________
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>
              Gideon Owhonda
            </div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>
              Founder &amp; CEO, Metabridge Academy
            </div>
          </div>

          {/* Right signature */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#1B2A4A', fontFamily: 'cursive', marginBottom: 2, letterSpacing: '2px' }}>
              _______________
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>
              Bright G. O
            </div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>
              Lead Instructor, Metabridge Academy
            </div>
          </div>
        </div>
      </div>

      {/* ── QR CODE ── bottom-right */}
      {qrDataUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            textAlign: 'center',
            zIndex: 3,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Scan to verify authenticity"
            style={{ width: 80, height: 80, display: 'block' }}
          />
          <div style={{ fontSize: 9, color: '#6B7280', marginTop: 3 }}>
            Scan to verify authenticity
          </div>
        </div>
      )}
    </div>
  );
}
