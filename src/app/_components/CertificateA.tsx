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
  <svg width="120" height="120" viewBox="0 0 200 200" style={{ display: 'block' }}>
    <circle cx="100" cy="100" r="96" fill="none" stroke="#2B8A9C" strokeWidth="2.5"/>
    <circle cx="100" cy="100" r="88" fill="none" stroke="#2B8A9C" strokeWidth="0.8"/>
    <circle cx="100" cy="100" r="80" fill="rgba(43,138,156,0.05)" stroke="#2B8A9C" strokeWidth="1.2"/>
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i * 15 * Math.PI) / 180;
      return (
        <line key={i}
          x1={100 + 76 * Math.cos(a)} y1={100 + 76 * Math.sin(a)}
          x2={100 + 82 * Math.cos(a)} y2={100 + 82 * Math.sin(a)}
          stroke="#2B8A9C" strokeWidth="1"/>
      );
    })}
    <defs>
      <path id="sealTop" d="M100,100 m-70,0 a70,70 0 1,1 140,0"/>
      <path id="sealBot" d="M100,100 m-62,0 a62,62 0 0,0 124,0"/>
    </defs>
    <text fontSize="9" fontFamily="Georgia,serif" fill="#1B2A4A" letterSpacing="4.5">
      <textPath href="#sealTop" startOffset="6%">METABRIDGE ACADEMY  ·  PORT HARCOURT  ·  NIGERIA</textPath>
    </text>
    <text fontSize="7.5" fontFamily="Georgia,serif" fill="#2B8A9C" letterSpacing="3">
      <textPath href="#sealBot" startOffset="14%">CERTIFICATE OF EXCELLENCE</textPath>
    </text>
    <polygon points="100,42 105,62 118,50 113,70 133,65 121,80 140,85 124,95 140,105 121,110 133,125 113,120 118,140 105,128 100,148 95,128 82,140 87,120 67,125 79,110 60,105 76,95 60,85 79,80 67,65 87,70 82,50 95,62"
      fill="none" stroke="#2B8A9C" strokeWidth="1.2" opacity="0.6"/>
    <text x="100" y="97" textAnchor="middle" fontSize="28" fontFamily="Georgia,serif"
      fill="#1B2A4A" fontWeight="700" letterSpacing="2">MA</text>
    <text x="100" y="113" textAnchor="middle" fontSize="7" fontFamily="sans-serif"
      fill="#2B8A9C" letterSpacing="4" fontWeight="600">CERTIFIED</text>
    {([[100,28],[172,100],[100,172],[28,100]] as [number,number][]).map(([cx,cy],i) => (
      <polygon key={i} points={`${cx},${cy-5} ${cx+5},${cy} ${cx},${cy+5} ${cx-5},${cy}`} fill="#F4891F"/>
    ))}
  </svg>
);

const Diamond = ({ size = 8, color = '#2B8A9C' }: { size?: number; color?: string }) => (
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
      { margin: 1, width: 90, color: { dark: '#1B2A4A', light: '#F8FAFC' } }
    ).then(setQrDataUrl);
  }, [certificateCode]);

  return (
    <div
      ref={divRef}
      style={{
        width: 794,
        height: 794,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        backgroundColor: '#F8FAFC',
        backgroundImage: `
          repeating-linear-gradient(45deg,  rgba(43,138,156,0.03) 0px, rgba(43,138,156,0.03) 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(-45deg, rgba(43,138,156,0.03) 0px, rgba(43,138,156,0.03) 1px, transparent 1px, transparent 22px)
        `,
      }}
    >
      {/* Single clean teal border */}
      <div style={{ position:'absolute', inset:10, border:'1.5px solid #2B8A9C', pointerEvents:'none', zIndex:6 }}/>

      {/* Navy-to-teal top bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:6,
        background:'linear-gradient(to right, #1B2A4A, #2B8A9C 30%, #F4891F 55%, #2B8A9C 75%, #1B2A4A)',
        zIndex:10,
      }}/>
      {/* Navy-to-teal bottom bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:6,
        background:'linear-gradient(to right, #1B2A4A, #2B8A9C 30%, #F4891F 55%, #2B8A9C 75%, #1B2A4A)',
        zIndex:10,
      }}/>

      {/* Certificate code top-left (subtle) */}
      {certificateCode && (
        <div style={{
          position:'absolute', top:20, left:24,
          fontSize:7, color:'rgba(27,42,74,0.3)', fontFamily:'Courier, monospace',
          letterSpacing:'1.5px', zIndex:4,
        }}>
          {certificateCode}
        </div>
      )}

      {/* Body */}
      <div style={{
        position:'absolute', inset:6,
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'28px 60px 12px',
        zIndex:3,
      }}>

        {/* Academy name header */}
        <div style={{ textAlign:'center', marginBottom:4 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:6 }}>
            <div style={{ width:50, height:0.5, background:'linear-gradient(to right, transparent, #2B8A9C)' }}/>
            <Diamond size={10} color="#2B8A9C"/>
            <div style={{ width:50, height:0.5, background:'linear-gradient(to left, transparent, #2B8A9C)' }}/>
          </div>
          <div style={{
            fontFamily:'var(--font-playfair), "Playfair Display", serif',
            fontSize:27, fontWeight:700, color:'#1B2A4A', letterSpacing:'2px', lineHeight:1.1,
          }}>
            Metabridge Academy
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8, margin:'8px auto', width:240 }}>
            <div style={{ flex:1, height:1, background:'linear-gradient(to right, transparent, #2B8A9C)' }}/>
            <Diamond size={7} color="#F4891F"/>
            <div style={{ flex:1, height:1, background:'linear-gradient(to left, transparent, #2B8A9C)' }}/>
          </div>

          <div style={{
            fontSize:9, color:'#F4891F', fontWeight:800, letterSpacing:'6px',
            textTransform:'uppercase',
          }}>
            {CERT_TITLE[beltLevel]}
          </div>
        </div>

        {/* Full-width teal rule */}
        <div style={{
          width:'100%', height:1,
          background:'linear-gradient(to right, transparent, rgba(43,138,156,0.5), rgba(43,138,156,0.7), rgba(43,138,156,0.5), transparent)',
          margin:'10px 0 12px',
        }}/>

        {/* Main certificate body */}
        <div style={{
          flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', textAlign:'center',
          width:'100%',
        }}>
          <div style={{ fontSize:12, color:'#2B8A9C', fontStyle:'italic', marginBottom:8, letterSpacing:'0.5px' }}>
            This is to certify that
          </div>

          <div style={{
            fontFamily:'var(--font-playfair), "Playfair Display", serif',
            fontSize:40, fontWeight:700, color:'#1B2A4A', lineHeight:1.12, minHeight:48,
          }}>
            {candidateName || ' '}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'8px 0 10px' }}>
            <div style={{ width:60, height:1.5, background:'linear-gradient(to right, transparent, #2B8A9C)' }}/>
            <Diamond size={7} color="#2B8A9C"/>
            <div style={{ width:60, height:1.5, background:'linear-gradient(to left, transparent, #2B8A9C)' }}/>
          </div>

          <div style={{ fontSize:12, color:'#2B8A9C', fontStyle:'italic', marginBottom:5 }}>
            has successfully completed the
          </div>

          <div style={{
            fontFamily:'var(--font-playfair), "Playfair Display", serif',
            fontSize:20, fontWeight:700, color:'#1B2A4A', lineHeight:1.3,
          }}>
            {courseName || ' '}
          </div>

          {/* Belt level — directly under course, smaller font */}
          <div style={{
            fontSize:12, fontStyle:'italic', color:'#2B8A9C',
            letterSpacing:'0.5px', marginTop:3, marginBottom:8,
          }}>
            {BELT_LABEL[beltLevel]}
          </div>

          <div style={{ fontSize:10.5, color:'#4A6070', letterSpacing:'0.3px', marginBottom:12 }}>
            programme with Metabridge Academy
          </div>

          {/* Acknowledgment */}
          <div style={{
            fontSize:10.5, color:'#4A6070', fontStyle:'italic', textAlign:'center',
            maxWidth:500, lineHeight:1.7, marginBottom:12,
            padding:'9px 16px',
            borderTop:'0.5px solid rgba(43,138,156,0.4)',
            borderBottom:'0.5px solid rgba(43,138,156,0.4)',
          }}>
            {ACK}
          </div>

          {/* Issued line */}
          <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:10.5 }}>
            <span style={{ color:'#4A6070' }}>
              Issued:&nbsp;<strong style={{ color:'#1B2A4A' }}>{dateIssued || ' '}</strong>
            </span>
            {studentId && (
              <>
                <div style={{ width:1, height:12, backgroundColor:'rgba(43,138,156,0.5)' }}/>
                <span style={{ fontFamily:'Courier, monospace', fontSize:9.5, color:'#4A6070', letterSpacing:'2px' }}>
                  ID: {studentId}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Seal + Signatures row */}
        <div style={{
          width:'100%', display:'flex', justifyContent:'space-between', alignItems:'flex-end',
          paddingTop:6, marginTop:4,
        }}>
          {/* Left — CEO */}
          <div style={{ textAlign:'center', width:170 }}>
            <div style={{ height:52, display:'flex', alignItems:'flex-end', justifyContent:'center', marginBottom:4 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/signatures/ceo.png" alt="CEO signature"
                style={{ width:155, height:52, objectFit:'contain', objectPosition:'bottom', display:'block' }}/>
            </div>
            <div style={{ width:158, height:1, background:'linear-gradient(to right, transparent, #2B8A9C, transparent)', margin:'0 auto 4px' }}/>
            <div style={{ fontSize:10.5, fontWeight:700, color:'#1B2A4A', letterSpacing:'0.3px' }}>Gideon Owhonda</div>
            <div style={{ fontSize:8.5, color:'#4A6070', marginTop:1 }}>CEO, Metabridge Academy</div>
          </div>

          {/* Centre seal */}
          <div style={{ flexShrink:0 }}>
            <MetabridgeSeal/>
          </div>

          {/* Right — Lead Instructor */}
          <div style={{ textAlign:'center', width:170 }}>
            <div style={{ height:52, display:'flex', alignItems:'flex-end', justifyContent:'center', marginBottom:4 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/signatures/instructor.png" alt="Lead Instructor signature"
                style={{ width:155, height:52, objectFit:'contain', objectPosition:'bottom', display:'block' }}/>
            </div>
            <div style={{ width:158, height:1, background:'linear-gradient(to right, transparent, #2B8A9C, transparent)', margin:'0 auto 4px' }}/>
            <div style={{ fontSize:10.5, fontWeight:700, color:'#1B2A4A', letterSpacing:'0.3px' }}>Bright G.O</div>
            <div style={{ fontSize:8.5, color:'#4A6070', marginTop:1 }}>Lead Instructor, Metabridge Academy</div>
          </div>
        </div>
      </div>

      {/* QR code — bottom-right, clear of right signature */}
      {qrDataUrl && (
        <div style={{ position:'absolute', bottom:16, right:22, textAlign:'center', zIndex:8 }}>
          <img src={qrDataUrl} alt="Scan to verify"
            style={{ width:54, height:54, display:'block', border:'1px solid rgba(43,138,156,0.4)' }}/>
          <div style={{ fontSize:6, color:'#2B8A9C', marginTop:2, letterSpacing:'1px', textTransform:'uppercase' }}>
            Scan to verify
          </div>
        </div>
      )}
    </div>
  );
}
