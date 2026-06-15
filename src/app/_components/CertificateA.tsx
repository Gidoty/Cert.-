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
        color: { dark: '#1B2A4A', light: '#FDF8EE' },
      }
    ).then((url) => setQrDataUrl(url));
  }, [certificateCode]);

  const HEADER_H = 159; // 20% of 793px

  return (
    <div
      ref={divRef}
      style={{
        width: 1122,
        height: 793,
        backgroundColor: '#FDF8EE',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
      {/* ── Gold left accent bar — full height ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: '#F4891F',
          zIndex: 10,
        }}
      />

      {/* ── Navy header band (top 20%) ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          backgroundColor: '#1B2A4A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
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
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          Port Harcourt
        </div>
        <div
          style={{
            width: 180,
            height: 1,
            backgroundColor: '#F4891F',
            opacity: 0.7,
            margin: '10px 0',
          }}
        />
        <div
          style={{
            fontSize: 12,
            color: '#F4891F',
            fontWeight: 800,
            letterSpacing: '5px',
            textTransform: 'uppercase',
          }}
        >
          Certificate of Completion
        </div>

        {/* Certificate code — top right, same level as "Port Harcourt" */}
        {certificateCode && (
          <div
            style={{
              position: 'absolute',
              top: 85,
              right: 24,
              color: 'white',
              fontFamily: 'Courier, monospace',
              fontSize: 11,
              opacity: 0.85,
              letterSpacing: '1px',
              textAlign: 'right',
            }}
          >
            {certificateCode}
          </div>
        )}
      </div>

      {/* ── Outer navy border (frames the whole certificate) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 8,
          border: '2px solid #1B2A4A',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* ── Body content — below the header band ── */}
      <div
        style={{
          position: 'absolute',
          top: HEADER_H,
          left: 6,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '30px 70px 18px',
        }}
      >
        {/* Central text block */}
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
              fontSize: 14,
              color: '#6B5A3A',
              fontStyle: 'italic',
              marginBottom: 14,
            }}
          >
            This is to certify that
          </div>

          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 42,
              fontWeight: 700,
              color: '#1B2A4A',
              lineHeight: 1.2,
              minHeight: 58,
            }}
          >
            {candidateName || ' '}
          </div>

          {/* Gold rule under name */}
          <div
            style={{
              width: 110,
              height: 2,
              backgroundColor: '#F4891F',
              margin: '12px auto 14px',
            }}
          />

          <div
            style={{
              fontSize: 13,
              color: '#6B5A3A',
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
              marginBottom: 6,
            }}
          >
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 12, color: '#8C7654' }}>
            training programme conducted by Metabridge Academy
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: '#6B5A3A' }}>
              Issued: {dateIssued || ' '}
            </div>

          </div>
        </div>

        {/* Signature */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid #C8B48A',
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
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>
              Bright G. O
            </div>
            <div style={{ fontSize: 11, color: '#8C7654' }}>
              Lead Instructor, Metabridge Academy
            </div>
          </div>
        </div>
      </div>

      {/* ── QR CODE — bottom-right ── */}
      {qrDataUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: 18,
            right: 18,
            textAlign: 'center',
            zIndex: 7,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Scan to verify"
            style={{ width: 72, height: 72, display: 'block' }}
          />
          <div style={{ fontSize: 8, color: '#A89272', marginTop: 2 }}>
            Scan to verify
          </div>
        </div>
      )}
    </div>
  );
}
