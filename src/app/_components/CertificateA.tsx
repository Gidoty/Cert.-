'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

type BeltLevel = 'Green Belt' | 'Blue Belt' | 'Black Belt';

interface CertificateAProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  studentId?: string;
  beltLevel?: BeltLevel;
  divRef?: RefObject<HTMLDivElement>;
}

const BELT_LABEL: Record<BeltLevel, string> = {
  'Green Belt': 'Green Belt (Foundation)',
  'Blue Belt':  'Blue Belt (Professional)',
  'Black Belt': 'Black Belt (Mastery)',
};

const CERT_TITLE: Record<BeltLevel, string> = {
  'Green Belt': 'Certificate of Completion',
  'Blue Belt':  'Certificate of Achievement',
  'Black Belt': 'Certificate of Mastery',
};

const ACK = 'In recognition of demonstrated technical competence, practical excellence, and commitment to building future-ready capabilities through digital technology.';

const MetabridgeSeal = () => (
  <svg width="160" height="160" viewBox="0 0 200 200" style={{ display: 'block' }}>
    <circle cx="100" cy="100" r="96" fill="none" stroke="#C9A84C" strokeWidth="2.5"/>
    <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
    <circle cx="100" cy="100" r="80" fill="rgba(201,168,76,0.06)" stroke="#C9A84C" strokeWidth="1.2"/>
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i * 15 * Math.PI) / 180;
      return (
        <line key={i}
          x1={100 + 76 * Math.cos(a)} y1={100 + 76 * Math.sin(a)}
          x2={100 + 82 * Math.cos(a)} y2={100 + 82 * Math.sin(a)}
          stroke="#C9A84C" strokeWidth="1"/>
      );
    })}
    <defs>
      <path id="sealTop" d="M100,100 m-70,0 a70,70 0 1,1 140,0"/>
      <path id="sealBot" d="M100,100 m-62,0 a62,62 0 0,0 124,0"/>
    </defs>
    <text fontSize="9" fontFamily="Georgia,serif" fill="#1B2A4A" letterSpacing="4.5">
      <textPath href="#sealTop" startOffset="6%">METABRIDGE ACADEMY  ·  PORT HARCOURT  ·  NIGERIA</textPath>
    </text>
    <text fontSize="7.5" fontFamily="Georgia,serif" fill="#C9A84C" letterSpacing="3">
      <textPath href="#sealBot" startOffset="14%">CERTIFICATE OF EXCELLENCE</textPath>
    </text>
    <polygon points="100,42 105,62 118,50 113,70 133,65 121,80 140,85 124,95 140,105 121,110 133,125 113,120 118,140 105,128 100,148 95,128 82,140 87,120 67,125 79,110 60,105 76,95 60,85 79,80 67,65 87,70 82,50 95,62"
      fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity="0.7"/>
    <text x="100" y="97" textAnchor="middle" fontSize="28" fontFamily="Georgia,serif"
      fill="#1B2A4A" fontWeight="700" letterSpacing="2">MA</text>
    <text x="100" y="113" textAnchor="middle" fontSize="7" fontFamily="sans-serif"
      fill="#C9A84C" letterSpacing="4" fontWeight="600">CERTIFIED</text>
    {([[100,28],[172,100],[100,172],[28,100]] as [number,number][]).map(([cx,cy],i) => (
      <polygon key={i} points={`${cx},${cy-5} ${cx+5},${cy} ${cx},${cy+5} ${cx-5},${cy}`} fill="#C9A84C"/>
    ))}
  </svg>
);

const CornerBracket = ({ rotate }: { rotate: number }) => (
  <svg width="58" height="58" viewBox="0 0 58 58"
    style={{ display: 'block', transform: `rotate(${rotate}deg)` }}>
    <path d="M5 5 L28 5 L5 28 Z" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
    <path d="M5 5 L20 5 L5 20 Z" fill="rgba(201,168,76,0.2)"/>
    <path d="M5 5 Q15 5 15 15" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
    <circle cx="5" cy="5" r="2.8" fill="#C9A84C"/>
    <circle cx="26" cy="5" r="1.1" fill="rgba(201,168,76,0.6)"/>
    <circle cx="5" cy="26" r="1.1" fill="rgba(201,168,76,0.6)"/>
  </svg>
);

const Diamond = ({ size = 8, color = '#C9A84C' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <polygon points="8,0 16,8 8,16 0,8" fill={color}/>
  </svg>
);

export default function CertificateA({
  candidateName,
  courseName,
  dateIssued,
  certificateCode,
  studentId,
  beltLevel = 'Green Belt',
  divRef,
}: CertificateAProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!certificateCode) return;
    QRCode.toDataURL(
      `https://cert-ashen.vercel.app/verify/${encodeURIComponent(certificateCode)}`,
      { margin: 1, width: 100, color: { dark: '#1B2A4A', light: '#FEFCF5' } }
    ).then(setQrDataUrl);
  }, [certificateCode]);

  return (
    <div
      ref={divRef}
      style={{
        width: 794,
        height: 1122,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        backgroundColor: '#FEFCF5',
        backgroundImage: `
          repeating-linear-gradient(45deg,  rgba(201,168,76,0.038) 0px, rgba(201,168,76,0.038) 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(-45deg, rgba(201,168,76,0.038) 0px, rgba(201,168,76,0.038) 1px, transparent 1px, transparent 22px)
        `,
      }}
    >
      {/* Borders */}
      <div style={{ position:'absolute', inset:10, border:'2.5px solid #C9A84C', pointerEvents:'none', zIndex:6 }}/>
      <div style={{ position:'absolute', inset:17, border:'0.75px solid rgba(27,42,74,0.22)', pointerEvents:'none', zIndex:6 }}/>
      <div style={{ position:'absolute', inset:22, border:'0.4px solid rgba(201,168,76,0.28)', pointerEvents:'none', zIndex:6 }}/>

      {/* Gold top bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:7,
        background:'linear-gradient(to right, #E8C96A, #C9A84C 30%, #F4891F 55%, #C9A84C 75%, #E8C96A)',
        zIndex:10,
      }}/>
      {/* Gold bottom bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:7,
        background:'linear-gradient(to right, #E8C96A, #C9A84C 30%, #F4891F 55%, #C9A84C 75%, #E8C96A)',
        zIndex:10,
      }}/>

      {/* Corner ornaments */}
      <div style={{ position:'absolute', top:10, left:10, zIndex:9 }}><CornerBracket rotate={0}/></div>
      <div style={{ position:'absolute', top:10, right:10, zIndex:9 }}><CornerBracket rotate={90}/></div>
      <div style={{ position:'absolute', bottom:10, right:10, zIndex:9 }}><CornerBracket rotate={180}/></div>
      <div style={{ position:'absolute', bottom:10, left:10, zIndex:9 }}><CornerBracket rotate={270}/></div>

      {/* Certificate code top-left (subtle) */}
      {certificateCode && (
        <div style={{
          position:'absolute', top:28, left:32,
          fontSize:7.5, color:'rgba(27,42,74,0.3)', fontFamily:'Courier, monospace',
          letterSpacing:'1.5px', zIndex:4,
        }}>
          {certificateCode}
        </div>
      )}

      {/* Body */}
      <div style={{
        position:'absolute', inset:7,
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'48px 64px 22px',
        zIndex:3,
      }}>

        {/* Academy name header — within parchment */}
        <div style={{ textAlign:'center', marginBottom:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:8 }}>
            <div style={{ width:50, height:0.5, background:'linear-gradient(to right, transparent, #C9A84C)' }}/>
            <Diamond size={10} color="#C9A84C"/>
            <div style={{ width:50, height:0.5, background:'linear-gradient(to left, transparent, #C9A84C)' }}/>
          </div>
          <div style={{
            fontFamily:'var(--font-playfair), "Playfair Display", serif',
            fontSize:30, fontWeight:700, color:'#1B2A4A', letterSpacing:'2px', lineHeight:1.1,
          }}>
            Metabridge Academy
          </div>
          <div style={{
            fontSize:8.5, color:'#8C7654', letterSpacing:'5px',
            textTransform:'uppercase', marginTop:5,
          }}>
            Port Harcourt · Nigeria
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8, margin:'10px auto', width:260 }}>
            <div style={{ flex:1, height:1, background:'linear-gradient(to right, transparent, #C9A84C)' }}/>
            <Diamond size={7} color="#F4891F"/>
            <div style={{ flex:1, height:1, background:'linear-gradient(to left, transparent, #C9A84C)' }}/>
          </div>

          <div style={{
            fontSize:10, color:'#F4891F', fontWeight:800, letterSpacing:'6px',
            textTransform:'uppercase',
          }}>
            {CERT_TITLE[beltLevel]}
          </div>
        </div>

        {/* Full-width gold rule */}
        <div style={{
          width:'100%', height:1,
          background:'linear-gradient(to right, transparent, rgba(201,168,76,0.5), rgba(201,168,76,0.7), rgba(201,168,76,0.5), transparent)',
          margin:'14px 0 18px',
        }}/>

        {/* Main certificate body */}
        <div style={{
          flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', textAlign:'center',
          width:'100%',
        }}>
          <div style={{ fontSize:13, color:'#7A6042', fontStyle:'italic', marginBottom:10, letterSpacing:'0.5px' }}>
            This is to certify that
          </div>

          <div style={{
            fontFamily:'var(--font-playfair), "Playfair Display", serif',
            fontSize:46, fontWeight:700, color:'#1B2A4A', lineHeight:1.12, minHeight:56,
          }}>
            {candidateName || ' '}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'10px 0 14px' }}>
            <div style={{ width:60, height:1.5, background:'linear-gradient(to right, transparent, #C9A84C)' }}/>
            <Diamond size={7} color="#C9A84C"/>
            <div style={{ width:60, height:1.5, background:'linear-gradient(to left, transparent, #C9A84C)' }}/>
          </div>

          <div style={{ fontSize:13, color:'#7A6042', fontStyle:'italic', marginBottom:7 }}>
            has successfully completed the
          </div>

          <div style={{
            fontFamily:'var(--font-playfair), "Playfair Display", serif',
            fontSize:23, fontWeight:700, color:'#1B2A4A', lineHeight:1.3,
          }}>
            {courseName || ' '}
          </div>

          {/* Belt level — directly under course, smaller font */}
          <div style={{
            fontSize:13, fontStyle:'italic', color:'#5A6E3A',
            letterSpacing:'0.5px', marginTop:4, marginBottom:10,
          }}>
            {BELT_LABEL[beltLevel]}
          </div>

          <div style={{ fontSize:11, color:'#8C7654', letterSpacing:'0.3px', marginBottom:16 }}>
            training programme with Metabridge Academy
          </div>

          {/* Acknowledgment */}
          <div style={{
            fontSize:11.5, color:'#7A6042', fontStyle:'italic', textAlign:'center',
            maxWidth:510, lineHeight:1.8, marginBottom:16,
            padding:'11px 18px',
            borderTop:'0.5px solid rgba(201,168,76,0.45)',
            borderBottom:'0.5px solid rgba(201,168,76,0.45)',
          }}>
            {ACK}
          </div>

          {/* Issued line */}
          <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:11 }}>
            <span style={{ color:'#7A6042' }}>
              Issued:&nbsp;<strong style={{ color:'#1B2A4A' }}>{dateIssued || ' '}</strong>
            </span>
            {studentId && (
              <>
                <div style={{ width:1, height:14, backgroundColor:'rgba(201,168,76,0.5)' }}/>
                <span style={{ fontFamily:'Courier, monospace', fontSize:10, color:'#8C7654', letterSpacing:'2px' }}>
                  ID: {studentId}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Seal */}
        <div style={{ margin:'10px 0 8px' }}>
          <MetabridgeSeal/>
        </div>

        {/* Signatures */}
        <div style={{
          width:'100%', display:'flex', justifyContent:'space-around', alignItems:'flex-end',
          paddingTop:8,
        }}>
          <div style={{ textAlign:'center' }}>
            <div style={{
              fontSize:21, fontFamily:'"Dancing Script", "Brush Script MT", cursive',
              color:'#1B2A4A', letterSpacing:'1px', marginBottom:3,
            }}>
              Gideon Owhonda
            </div>
            <div style={{ width:158, height:1, background:'linear-gradient(to right, transparent, #C9A84C, transparent)', margin:'0 auto 5px' }}/>
            <div style={{ fontSize:11, fontWeight:700, color:'#1B2A4A', letterSpacing:'0.3px' }}>Gideon Owhonda</div>
            <div style={{ fontSize:9, color:'#8C7654', marginTop:2 }}>CEO, Metabridge Academy</div>
          </div>

          <div style={{ paddingBottom:6 }}><Diamond size={8} color="rgba(201,168,76,0.38)"/></div>

          <div style={{ textAlign:'center' }}>
            <div style={{
              fontSize:21, fontFamily:'"Dancing Script", "Brush Script MT", cursive',
              color:'#1B2A4A', letterSpacing:'1px', marginBottom:3,
            }}>
              Bright G. Owhonda
            </div>
            <div style={{ width:158, height:1, background:'linear-gradient(to right, transparent, #C9A84C, transparent)', margin:'0 auto 5px' }}/>
            <div style={{ fontSize:11, fontWeight:700, color:'#1B2A4A', letterSpacing:'0.3px' }}>Bright G. O</div>
            <div style={{ fontSize:9, color:'#8C7654', marginTop:2 }}>Lead Instructor, Metabridge Academy</div>
          </div>
        </div>
      </div>

      {/* QR code */}
      {qrDataUrl && (
        <div style={{ position:'absolute', bottom:16, right:20, textAlign:'center', zIndex:7 }}>
          <img src={qrDataUrl} alt="Scan to verify"
            style={{ width:66, height:66, display:'block', border:'1px solid rgba(201,168,76,0.38)' }}/>
          <div style={{ fontSize:7, color:'#A89272', marginTop:2, letterSpacing:'1px', textTransform:'uppercase' }}>
            Scan to verify
          </div>
        </div>
      )}
    </div>
  );
}
