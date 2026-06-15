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
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
      {/* Left orange accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: '#F4891F',
          zIndex: 2,
        }}
      />

      {/* Outer navy border */}
      <div
        style={{
          position: 'absolute',
          inset: 10,
          border: '2px solid #1B2A4A',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main content area */}
      <div
        style={{
          position: 'absolute',
          inset: 26,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', paddingTop: 28 }}>
          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 30,
              fontWeight: 700,
              color: '#1B2A4A',
              letterSpacing: '0.5px',
              lineHeight: 1.2,
            }}
          >
            Metabridge Academy
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#6B7280',
              fontStyle: 'italic',
              marginTop: 4,
            }}
          >
            Gateway to Digital Literacy
          </div>

          {/* Thin horizontal rule */}
          <div
            style={{
              width: '60%',
              margin: '10px auto',
              height: 1,
              backgroundColor: '#E5E7EB',
            }}
          />

          {/* Certificate type label */}
          <div
            style={{
              fontSize: 14,
              color: '#F4891F',
              fontWeight: 800,
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Certificate of Completion
          </div>

          {/* Top decorative rule beneath header */}
          <div
            style={{
              width: '80%',
              margin: '10px auto 0',
              height: 1,
              backgroundColor: '#F4891F',
              opacity: 0.4,
            }}
          />
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
            paddingTop: 8,
          }}
        >
          <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>
            This is to certify that
          </div>

          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 40,
              fontWeight: 700,
              color: '#1B2A4A',
              lineHeight: 1.2,
              marginTop: 10,
              marginBottom: 4,
              minHeight: 56,
            }}
          >
            {candidateName || ' '}
          </div>

          <div style={{ fontSize: 13, color: '#4B5563', marginTop: 10 }}>
            has successfully completed the
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#1B2A4A',
              marginTop: 6,
            }}
          >
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
            training programme conducted by Metabridge Academy
          </div>

          {/* Date and code */}
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6B7280' }}>
              Issued: {dateIssued || ' '}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                fontFamily: 'Courier, monospace',
                marginTop: 4,
                letterSpacing: '1px',
              }}
            >
              {certificateCode || ' '}
            </div>
          </div>
        </div>

        {/* ── SIGNATURES ── */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid #E5E7EB',
            paddingTop: 16,
            paddingBottom: 20,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 18,
                color: '#1B2A4A',
                fontFamily: 'cursive',
                marginBottom: 2,
                letterSpacing: '2px',
              }}
            >
              _______________
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1B2A4A',
              }}
            >
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
            alt="Scan to verify"
            style={{ width: 80, height: 80, display: 'block' }}
          />
          <div
            style={{
              fontSize: 9,
              color: '#9CA3AF',
              marginTop: 3,
              textAlign: 'center',
            }}
          >
            Scan to verify
          </div>
        </div>
      )}
    </div>
  );
}
