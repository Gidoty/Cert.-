'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

interface CertificateBProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  beltLevel?: 'Blue Belt' | 'Black Belt';
  divRef?: RefObject<HTMLDivElement>;
}

const CornerDiamond = ({ flip }: { flip?: string }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: 'block', transform: flip }}>
    <polygon points="16,1 31,16 16,31 1,16" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
    <polygon points="16,5 27,16 16,27 5,16" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="0.75"/>
    <circle cx="16" cy="16" r="2.5" fill="#C9A84C"/>
  </svg>
);

const Diamond = ({ size = 10, color = '#C9A84C' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <polygon points="10,0 20,10 10,20 0,10" fill={color} />
  </svg>
);

const AcademySeal = () => (
  <svg width="260" height="260" viewBox="0 0 260 260" style={{ display: 'block' }}>
    <circle cx="130" cy="130" r="122" fill="none" stroke="#1B2A4A" strokeWidth="2.5"/>
    <circle cx="130" cy="130" r="110" fill="none" stroke="#C9A84C" strokeWidth="1"/>
    <circle cx="130" cy="130" r="98" fill="none" stroke="#1B2A4A" strokeWidth="0.6"/>
    <defs>
      <path id="sealArcB" d="M130,130 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1,-184,0"/>
    </defs>
    <text fontSize="10.5" fontFamily="Georgia,serif" fill="#1B2A4A" letterSpacing="5.8">
      <textPath href="#sealArcB" startOffset="8%">
        METABRIDGE ACADEMY  •  PORT HARCOURT  •  NIGERIA  •
      </textPath>
    </text>
    <polygon points="130,74 138,101 167,101 144,118 152,145 130,129 108,145 116,118 93,101 122,101"
      fill="none" stroke="#1B2A4A" strokeWidth="1.5"/>
    <text x="130" y="141" textAnchor="middle" fontSize="34" fontFamily="Georgia,serif" fill="#1B2A4A" fontWeight="700">MA</text>
    <text x="130" y="160" textAnchor="middle" fontSize="7.5" fontFamily="sans-serif" fill="#1B2A4A" letterSpacing="3.5">CERTIFIED</text>
  </svg>
);

export default function CertificateB({
  candidateName,
  courseName,
  dateIssued,
  certificateCode,
  beltLevel = 'Blue Belt',
  divRef,
}: CertificateBProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!certificateCode) return;
    QRCode.toDataURL(
      `https://cert-ashen.vercel.app/verify/${encodeURIComponent(certificateCode)}`,
      { margin: 1, width: 110, color: { dark: '#1B2A4A', light: '#EEF3F8' } }
    ).then((url) => setQrDataUrl(url));
  }, [certificateCode]);

  const isBlack = beltLevel === 'Black Belt';

  const badge = isBlack
    ? { bg: '#0D0A00', border: 'rgba(201,168,76,0.5)', text: '#C9A84C' }
    : { bg: '#1e3a8a', border: 'rgba(255,255,255,0.22)', text: '#FFFFFF' };

  return (
    <div
      ref={divRef}
      style={{
        width: 1122,
        height: 793,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        backgroundColor: '#EEF3F8',
        backgroundImage: `
          radial-gradient(circle, rgba(201,168,76,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Academy seal watermark */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.052, zIndex: 1, pointerEvents: 'none' }}>
        <AcademySeal />
      </div>

      {/* Outer navy border */}
      <div style={{ position: 'absolute', inset: 8, border: '3px solid #1B2A4A', pointerEvents: 'none', zIndex: 6 }} />
      {/* Middle gold border */}
      <div style={{ position: 'absolute', inset: 15, border: '1.5px solid #C9A84C', pointerEvents: 'none', zIndex: 6 }} />
      {/* Inner fine border */}
      <div style={{ position: 'absolute', inset: 22, border: '0.6px solid rgba(27,42,74,0.25)', pointerEvents: 'none', zIndex: 6 }} />

      {/* Corner diamond ornaments */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 9 }}><CornerDiamond /></div>
      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 9 }}><CornerDiamond flip="scale(-1,1)" /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 9 }}><CornerDiamond flip="scale(1,-1)" /></div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 9 }}><CornerDiamond flip="scale(-1,-1)" /></div>

      {/* Navy header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 190,
        background: 'linear-gradient(150deg, #0A1628 0%, #1B2A4A 50%, #0E1F3A 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.14) 0%, transparent 62%)',
          pointerEvents: 'none',
        }} />

        {/* Belt badge */}
        <div style={{
          position: 'absolute', top: 20, right: 34,
          backgroundColor: badge.bg, border: `1px solid ${badge.border}`,
          color: badge.text, fontSize: 8.5, fontWeight: 800,
          letterSpacing: '3px', textTransform: 'uppercase', padding: '5px 14px', zIndex: 4,
        }}>
          {beltLevel}
        </div>

        {/* Certificate code top-left */}
        {certificateCode && (
          <div style={{
            position: 'absolute', top: 22, left: 34,
            fontSize: 8, color: 'rgba(255,255,255,0.35)', fontFamily: 'Courier, monospace',
            letterSpacing: '1.5px', zIndex: 4,
          }}>
            {certificateCode}
          </div>
        )}

        <div style={{ marginBottom: 8, position: 'relative', zIndex: 3 }}>
          <Diamond size={12} color="#C9A84C" />
        </div>

        <div style={{
          fontFamily: 'var(--font-playfair), "Playfair Display", serif',
          fontSize: 37, fontWeight: 700, color: '#FFFFFF', letterSpacing: '1.5px', lineHeight: 1.1, position: 'relative', zIndex: 3,
        }}>
          Metabridge Academy
        </div>

        <div style={{
          fontSize: 9.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '5.5px',
          textTransform: 'uppercase', marginTop: 8, position: 'relative', zIndex: 3,
        }}>
          Port Harcourt · Nigeria
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '11px 0 9px', width: 320, position: 'relative', zIndex: 3 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
          <Diamond size={9} color="#F4891F" />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
        </div>

        <div style={{
          fontSize: 11, color: '#F4891F', fontWeight: 800, letterSpacing: '6px',
          textTransform: 'uppercase', position: 'relative', zIndex: 3,
        }}>
          Certificate of Achievement
        </div>
      </div>

      {/* Body */}
      <div style={{
        position: 'absolute', top: 190, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 90px 15px', zIndex: 3,
      }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: '#4A5B72', fontStyle: 'italic', marginBottom: 12, letterSpacing: '0.5px' }}>
            Awarded to
          </div>

          <div style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 50, fontWeight: 700, color: '#1B2A4A', lineHeight: 1.12, minHeight: 64,
          }}>
            {candidateName || ' '}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0 15px' }}>
            <div style={{ width: 65, height: 1.5, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
            <Diamond size={8} color="#C9A84C" />
            <div style={{ width: 65, height: 1.5, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
          </div>

          <div style={{ fontSize: 13, color: '#4A5B72', fontStyle: 'italic', marginBottom: 8, maxWidth: 560, lineHeight: 1.6 }}>
            In recognition of dedicated commitment and successful completion of the
          </div>

          <div style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 25, fontWeight: 700, color: '#1B2A4A', marginBottom: 5, lineHeight: 1.3,
          }}>
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 11.5, color: '#5E7A96', letterSpacing: '0.3px', marginBottom: 18 }}>
            certification programme at Metabridge Academy
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 11 }}>
            <span style={{ color: '#4A5B72' }}>
              Issued:&nbsp;<strong style={{ color: '#1B2A4A' }}>{dateIssued || ' '}</strong>
            </span>
            {certificateCode && (
              <>
                <div style={{ width: 1, height: 14, backgroundColor: 'rgba(201,168,76,0.45)' }} />
                <span style={{ fontFamily: 'Courier, monospace', fontSize: 10, color: '#5E7A96', letterSpacing: '2px' }}>
                  {certificateCode}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Signatures */}
        <div style={{ width: '100%', paddingTop: 14, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 158, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', letterSpacing: '0.3px' }}>Gideon Owhonda</div>
            <div style={{ fontSize: 10, color: '#5E7A96', marginTop: 2 }}>Founder &amp; CEO, Metabridge Academy</div>
          </div>
          <div style={{ paddingBottom: 5 }}><Diamond size={9} color="rgba(201,168,76,0.38)" /></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 158, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', letterSpacing: '0.3px' }}>Bright G. O</div>
            <div style={{ fontSize: 10, color: '#5E7A96', marginTop: 2 }}>Lead Instructor, Metabridge Academy</div>
          </div>
        </div>
      </div>

      {/* QR code */}
      {qrDataUrl && (
        <div style={{ position: 'absolute', bottom: 20, right: 24, textAlign: 'center', zIndex: 7 }}>
          <img
            src={qrDataUrl}
            alt="Scan to verify"
            style={{ width: 78, height: 78, display: 'block', border: '1px solid rgba(201,168,76,0.38)' }}
          />
          <div style={{ fontSize: 7.5, color: '#5E7A96', marginTop: 2, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Scan to verify
          </div>
        </div>
      )}
    </div>
  );
}
