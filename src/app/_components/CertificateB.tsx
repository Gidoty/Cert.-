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

const CornerDiamond = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <polygon points="10,0 20,10 10,20 0,10" fill="#F4891F" />
  </svg>
);

const SmallDiamond = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'inline-block' }}>
    <polygon points="10,0 20,10 10,20 0,10" fill="#F4891F" />
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
        <div style={{ marginBottom: 6 }}>
          <SmallDiamond size={14} />
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
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          Port Harcourt
        </div>

        {/* Gold divider with centre diamond */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: '10px 0',
            width: 240,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#F4891F',
              opacity: 0.65,
            }}
          />
          <SmallDiamond size={8} />
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#F4891F',
              opacity: 0.65,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 12,
            color: '#F4891F',
            fontWeight: 800,
            letterSpacing: '5px',
            textTransform: 'uppercase',
          }}
        >
          Certificate of Achievement
        </div>
      </div>

      {/* ── Outer navy border (full certificate) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 8,
          border: '3px solid #1B2A4A',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Inner gold border (full certificate) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 15,
          border: '1.5px solid #F4891F',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── Corner diamond ornaments (sit on the outer border corners) ── */}
      <div style={{ position: 'absolute', top: -1, left: -1, zIndex: 8 }}>
        <CornerDiamond />
      </div>
      <div style={{ position: 'absolute', top: -1, right: -1, zIndex: 8 }}>
        <CornerDiamond />
      </div>
      <div style={{ position: 'absolute', bottom: -1, left: -1, zIndex: 8 }}>
        <CornerDiamond />
      </div>
      <div style={{ position: 'absolute', bottom: -1, right: -1, zIndex: 8 }}>
        <CornerDiamond />
      </div>

      {/* ── Body content — below the header band ── */}
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
              marginBottom: 12,
            }}
          >
            Awarded to
          </div>

          {/* Candidate name — the centrepiece */}
          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 46,
              fontWeight: 700,
              color: '#1B2A4A',
              lineHeight: 1.2,
              minHeight: 65,
            }}
          >
            {candidateName || ' '}
          </div>

          {/* Gold horizontal rule under name */}
          <div
            style={{
              width: 140,
              height: 2,
              backgroundColor: '#F4891F',
              margin: '12px auto 16px',
            }}
          />

          <div
            style={{
              fontSize: 13,
              color: '#6B5A3A',
              fontStyle: 'italic',
              marginBottom: 8,
              maxWidth: 540,
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

          <div style={{ fontSize: 12, color: '#8C7654' }}>
            certification programme at Metabridge Academy
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: '#6B5A3A' }}>
              Issued: {dateIssued || ' '}
            </div>
            {certificateCode && (
              <div
                style={{
                  fontSize: 10,
                  color: '#A89272',
                  fontFamily: 'Courier, monospace',
                  marginTop: 4,
                  letterSpacing: '1.5px',
                }}
              >
                {certificateCode}
              </div>
            )}
          </div>
        </div>

        {/* Signatures */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid #C8B48A',
            paddingTop: 14,
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          {/* Left: Founder */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 140,
                borderBottom: '1px solid #1B2A4A',
                margin: '0 auto 6px',
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>
              Gideon Owhonda
            </div>
            <div style={{ fontSize: 11, color: '#8C7654' }}>
              Founder &amp; CEO, Metabridge Academy
            </div>
          </div>

          {/* Right: Instructor */}
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
            bottom: 22,
            right: 24,
            textAlign: 'center',
            zIndex: 7,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Scan to verify authenticity"
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
