'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

const BRIGHT_SIG_B64 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABaAHsDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAECBAUDBgf/xAA4EAABBAEDAwICBwUJAAAAAAABAAIDBBEFElETITEGQXGBByIyQmGhsRQzUnLRQ1NiZHOCkbPB/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAEDAgQF/8QAJBEAAgIBBAEEAwAAAAAAAAAAAAECERIDITFBoQQUUWFxsfD/2gAMAwEAAhEDEQA/APsQOCgnvkISC4DtJNKTu6EIAEISTAaSCktJmWMpIQmIEZQllArJBCSEAPKMpIQMeUJZQFI2PKCkhMATJUcoyOUxNjRlRyhaSMtjyq1e7DYt2azCepWcGvBHIz2XfK8w+Z9LXWX92IJtQkpzcDc1uw/Jzcf7lXTgp2YbPUIykglTGPKeVFCAJJJZQgAypZUCcJqRUeUt4ORnwhRLWhOhNmVPfmu6nNplCZsRrBpszYyWF3cNAPvjvlEml32t31dbtib7omDXsJ4IwO3wWd6cs9T1j6nhP3Ja+34dPH65W1qVwVYgI29SxIdsMY8ud/4B5JXZOLhJQj8LyrJ3ZHQdQdqWlQ23xiN7tzZGA5DXtcWuA/DIKt2Jmw15JnZ2xsLz8AMqvptVlGjFVj7hg7nkk5J+ZJT1F8ApyxzzMibIxzMucB5BClLFzdcB0R02zanrQzTxRBsrQ4GNxOARkZys59MaloOpVm9ny2JzGeHh/wBU/ItCPSmpRWfT2nmMSzPEDGOLGHGQNp7+PZVNLt3rkdilpzOg2O1MJbUncNJkJwwe7vyCuoSjKVbUzNmrp+s1ZtKrXLE8cT5Yg57Se4d4cMfgcrQhljmjbLG8PY4Za4eCvO+mNPhoWtU07JcWWBMHH7TmyDd3Pn7QcvQRtbGwMY0NaOwAGFLWUIyaiNWddyN3ZQynlSGTyEblDKO6ADKecqOUZU0VJBIoys7UptTitR/steN9bB6jsbn59sDI7LcI5OjMjyFS3cq/SPrVTTqbZ7E8W7MjtsbMFpDnH37O8DuvR1dFuCR1q7rNiSy8Yc6FjY2gcDsSAvI0Xm/9IDJXapbhjswS4Ii6Bdt2g4z7Hb2Pvhe1Hp/THHMzJ5yf72w92fzXp+qktNx6tK9r+uyMUZevdWmYOl6mlqxF+JnvcyQjjse4GfJ9lw0bW9ChtSVrkld96IBwmbum6zc/aacEjv5Hst00dC05oc6pRr8Esbk/89yo0YXWNWOoGAQQxQmGBpbhztxBc4j2HYAfNQWpBwdp+EarcyPTGtVYqdulDXvy9C5M1gjquOGudvb5A9nKn6c1qzpGizRWtGvuigsytEwDQH/W9wTkHPtyvR6Tlut60B4dNC75mIZ/RZWjw2HXbNiehJZAtTOru6jenGN59v4sjyq5weVrZ0+f75MtMz5dU9Q2/UVebTdE/YW26roy+9IATsduyGjPs4+VuaZR16GSSWzqNd75MZBY5waBwMgLnq8eozarpL5JY6oM8kY6P1ngOjcT3Pb7q72akNGzQkhfM6WSy2NznyucXAtcTn29lic04pRSW358saVF4V7p/eaiR/pwtb+uV0bVH37Fh/xfgfku+ULjyZuiLImN8D5k5XRRyjP4pACFDKWSplDrlNcg5SyMJgZFr01p81uO0wzQyRhwaGOy0bvP1TkKLtCmhiArapdIHfpPlw134ZAyFtZRlV9xqcWYcUZdCHT4pxvqdC1zMd5P8rj5WqeVCRrJG7ZGhzeCMrh0pYu8Eh2/wP7j5HyFmUstxHLTInNuajOQR1bIxnhrGt/qo+nwW6e4Ef283/Y5WBZaDtmBid/i8H4FVWR3K0srqjIp4JXF4a5+0tcfPf3HutbyTT+vABq3fUtIb/mHvPwETv6oZjUNQisMOa1UuMbvZ8hGMj8AM9+SqDas+q6yX3pWur1Yyzpw5DHPdjIJ8uwAM/FbwDWMDWNDWgYAAwAqSqCS7r9i5JIyoeU8j4KI7JIUSUbkCOe9vIS3t5VDJ5KYJwe6WJvIv728o3jlZ+Tynk48oxFkaG9qfUHKzgTyVJpPKMRNl/eOUdQcqhk8lMk8lGIWXXEEYOCCq8tSrL9phH8jy39CuTSc+SpAnlaVrgy2WYmRQxiOJrWMb4A8BS3DlVMnlGTykKy3uHIRuHIVTJ5TBPKAst5CMhVcnkoyeSnQWf/Z';
const GIDEON_SIG_B64 = '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';

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${GIDEON_SIG_B64}`}
              alt=""
              style={{
                width: 120,
                height: 'auto',
                display: 'block',
                margin: '0 auto 2px',
                mixBlendMode: 'multiply',
                opacity: 0.9,
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
              src={`data:image/jpeg;base64,${BRIGHT_SIG_B64}`}
              alt=""
              style={{
                width: 120,
                height: 'auto',
                display: 'block',
                margin: '0 auto 2px',
                mixBlendMode: 'multiply',
                opacity: 0.9,
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
