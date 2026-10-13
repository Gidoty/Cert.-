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

const CornerBracket = ({ flip }: { flip?: string }) => (
  <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', transform: flip }}>
    <path d="M 3 30 L 3 3 L 30 3" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 10 30 L 10 10 L 30 10" fill="none" stroke="rgba(201,168,76,0.38)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="3" cy="3" r="2.8" fill="#C9A84C"/>
    <circle cx="10" cy="10" r="1.6" fill="rgba(201,168,76,0.5)"/>
    <path d="M 20 3 Q 3 3 3 20" fill="none" stroke="rgba(201,168,76,0.17)" strokeWidth="1"/>
  </svg>
);

const Diamond = ({ size = 10, color = '#C9A84C' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <polygon points="10,0 20,10 10,20 0,10" fill={color} />
  </svg>
);

const AcademySeal = () => (
  <svg width="256" height="256" viewBox="0 0 256 256" style={{ display: 'block' }}>
    <circle cx="128" cy="128" r="120" fill="none" stroke="#1B2A4A" strokeWidth="2.5"/>
    <circle cx="128" cy="128" r="108" fill="none" stroke="#C9A84C" strokeWidth="1"/>
    <circle cx="128" cy="128" r="96" fill="none" stroke="#1B2A4A" strokeWidth="0.6"/>
    <defs>
      <path id="sealArc" d="M128,128 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1,-180,0"/>
    </defs>
    <text fontSize="10.5" fontFamily="Georgia,serif" fill="#1B2A4A" letterSpacing="5.8">
      <textPath href="#sealArc" startOffset="8%">
        METABRIDGE ACADEMY  •  PORT HARCOURT  •  NIGERIA  •
      </textPath>
    </text>
    <polygon points="128,72 136,99 165,99 142,116 150,143 128,127 106,143 114,116 91,99 120,99"
      fill="none" stroke="#1B2A4A" strokeWidth="1.5"/>
    <text x="128" y="139" textAnchor="middle" fontSize="34" fontFamily="Georgia,serif" fill="#1B2A4A" fontWeight="700">MA</text>
    <text x="128" y="158" textAnchor="middle" fontSize="7.5" fontFamily="sans-serif" fill="#1B2A4A" letterSpacing="3.5">CERTIFIED</text>
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
      `https://cert-ashen.vercel.app/verify/${encodeURIComponent(certificateCode)}`,
      { margin: 1, width: 110, color: { dark: '#1B2A4A', light: '#FEFCF5' } }
    ).then((url) => setQrDataUrl(url));
  }, [certificateCode]);

  return (
    <div
      ref={divRef}
      style={{
        width: 1122,
        height: 793,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        backgroundColor: '#FEFCF5',
        backgroundImage: `
          repeating-linear-gradient(45deg,  rgba(201,168,76,0.042) 0px, rgba(201,168,76,0.042) 1px, transparent 1px, transparent 24px),
          repeating-linear-gradient(-45deg, rgba(201,168,76,0.042) 0px, rgba(201,168,76,0.042) 1px, transparent 1px, transparent 24px)
        `,
      }}
    >
      {/* Academy seal watermark */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.056, zIndex: 1, pointerEvents: 'none' }}>
        <AcademySeal />
      </div>

      {/* Outer gold border */}
      <div style={{ position: 'absolute', inset: 10, border: '2.5px solid #C9A84C', pointerEvents: 'none', zIndex: 6 }} />
      {/* Inner soft border */}
      <div style={{ position: 'absolute', inset: 18, border: '0.8px solid rgba(27,42,74,0.28)', pointerEvents: 'none', zIndex: 6 }} />

      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 9 }}><CornerBracket /></div>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 9 }}><CornerBracket flip="scale(-1,1)" /></div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 9 }}><CornerBracket flip="scale(1,-1)" /></div>
      <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 9 }}><CornerBracket flip="scale(-1,-1)" /></div>

      {/* Gold left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 8,
        background: 'linear-gradient(to bottom, #E8C96A, #C9A84C 25%, #F4891F 55%, #C9A84C 80%, #E8C96A)',
        zIndex: 10,
      }} />

      {/* Navy header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 188,
        background: 'linear-gradient(150deg, #0D1B35 0%, #1B2A4A 50%, #12233E 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.13) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Green Belt badge */}
        <div style={{
          position: 'absolute', top: 20, right: 34,
          backgroundColor: '#166534', border: '1px solid rgba(255,255,255,0.22)',
          color: '#FFFFFF', fontSize: 8.5, fontWeight: 800,
          letterSpacing: '3px', textTransform: 'uppercase', padding: '5px 14px', zIndex: 4,
        }}>
          Green Belt
        </div>

        {/* S/N in top-left of header */}
        {certificateCode && (
          <div style={{
            position: 'absolute', top: 22, left: 34,
            fontSize: 8, color: 'rgba(255,255,255,0.38)', fontFamily: 'Courier, monospace',
            letterSpacing: '1.5px', zIndex: 4,
          }}>
            {certificateCode}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10, position: 'relative', zIndex: 3 }}>
          <div style={{ width: 60, height: 0.5, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.55))' }} />
          <Diamond size={11} color="#C9A84C" />
          <div style={{ width: 60, height: 0.5, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.55))' }} />
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '11px 0 9px', width: 310, position: 'relative', zIndex: 3 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
          <Diamond size={9} color="#F4891F" />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
        </div>

        <div style={{
          fontSize: 11, color: '#F4891F', fontWeight: 800, letterSpacing: '6px',
          textTransform: 'uppercase', position: 'relative', zIndex: 3,
        }}>
          Certificate of Completion
        </div>
      </div>

      {/* Body */}
      <div style={{
        position: 'absolute', top: 188, left: 8, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 90px 15px', zIndex: 3,
      }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: '#7A6042', fontStyle: 'italic', marginBottom: 12, letterSpacing: '0.5px' }}>
            This is to certify that
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

          <div style={{ fontSize: 13, color: '#7A6042', fontStyle: 'italic', marginBottom: 8 }}>
            has successfully completed the
          </div>

          <div style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 25, fontWeight: 700, color: '#1B2A4A', marginBottom: 5, lineHeight: 1.3,
          }}>
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 11.5, color: '#8C7654', letterSpacing: '0.3px', marginBottom: 18 }}>
            training programme conducted by Metabridge Academy
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 11 }}>
            <span style={{ color: '#7A6042' }}>
              Issued:&nbsp;<strong style={{ color: '#1B2A4A' }}>{dateIssued || ' '}</strong>
            </span>
            {certificateCode && (
              <>
                <div style={{ width: 1, height: 14, backgroundColor: 'rgba(201,168,76,0.45)' }} />
                <span style={{ fontFamily: 'Courier, monospace', fontSize: 10, color: '#8C7654', letterSpacing: '2px' }}>
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
            <div style={{ fontSize: 10, color: '#8C7654', marginTop: 2 }}>Founder &amp; CEO, Metabridge Academy</div>
          </div>
          <div style={{ paddingBottom: 5 }}><Diamond size={9} color="rgba(201,168,76,0.38)" /></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 158, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1B2A4A', letterSpacing: '0.3px' }}>Bright G. O</div>
            <div style={{ fontSize: 10, color: '#8C7654', marginTop: 2 }}>Lead Instructor, Metabridge Academy</div>
          </div>
        </div>
      </div>

      {/* QR code */}
      {qrDataUrl && (
        <div style={{ position: 'absolute', bottom: 20, right: 22, textAlign: 'center', zIndex: 7 }}>
          <img
            src={qrDataUrl}
            alt="Scan to verify"
            style={{ width: 78, height: 78, display: 'block', border: '1px solid rgba(201,168,76,0.38)' }}
          />
          <div style={{ fontSize: 7.5, color: '#A89272', marginTop: 2, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Scan to verify
          </div>
        </div>
      )}
    </div>
  );
}
