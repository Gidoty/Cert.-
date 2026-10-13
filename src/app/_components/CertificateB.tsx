'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

interface CertificateBProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  studentId?: string;
  beltLevel?: 'Blue Belt' | 'Black Belt';
  divRef?: RefObject<HTMLDivElement>;
}

const MetabridgeSeal = ({ dark }: { dark?: boolean }) => {
  const ring = dark ? '#C9A84C' : '#1B2A4A';
  const inner = dark ? 'rgba(201,168,76,0.12)' : 'rgba(27,42,74,0.07)';
  const text = dark ? '#C9A84C' : '#1B2A4A';
  const certText = dark ? '#E8C96A' : '#C9A84C';
  return (
    <svg width="180" height="180" viewBox="0 0 200 200" style={{ display:'block' }}>
      <circle cx="100" cy="100" r="96" fill="none" stroke={ring} strokeWidth="2.5"/>
      <circle cx="100" cy="100" r="88" fill="none" stroke={ring} strokeWidth="0.8"/>
      <circle cx="100" cy="100" r="80" fill={inner} stroke={ring} strokeWidth="1.2"/>
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 100 + 76 * Math.cos(angle); const y1 = 100 + 76 * Math.sin(angle);
        const x2 = 100 + 82 * Math.cos(angle); const y2 = 100 + 82 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ring} strokeWidth="1"/>;
      })}
      <defs>
        <path id="topArcB" d="M100,100 m-70,0 a70,70 0 1,1 140,0"/>
        <path id="botArcB" d="M100,100 m-62,0 a62,62 0 0,0 124,0"/>
      </defs>
      <text fontSize="9" fontFamily="Georgia,serif" fill={text} letterSpacing="4.5">
        <textPath href="#topArcB" startOffset="6%">METABRIDGE ACADEMY  ·  PORT HARCOURT  ·  NIGERIA</textPath>
      </text>
      <text fontSize="7.5" fontFamily="Georgia,serif" fill={certText} letterSpacing="3">
        <textPath href="#botArcB" startOffset="14%">CERTIFICATE OF EXCELLENCE</textPath>
      </text>
      <polygon points="100,42 105,62 118,50 113,70 133,65 121,80 140,85 124,95 140,105 121,110 133,125 113,120 118,140 105,128 100,148 95,128 82,140 87,120 67,125 79,110 60,105 76,95 60,85 79,80 67,65 87,70 82,50 95,62"
        fill="none" stroke={ring} strokeWidth="1.2" opacity="0.7"/>
      <text x="100" y="97" textAnchor="middle" fontSize="28" fontFamily="Georgia,serif"
        fill={text} fontWeight="700" letterSpacing="2">MA</text>
      <text x="100" y="113" textAnchor="middle" fontSize="7" fontFamily="sans-serif"
        fill={certText} letterSpacing="4" fontWeight="600">CERTIFIED</text>
      {[[100,28],[172,100],[100,172],[28,100]].map(([cx,cy],i) => (
        <polygon key={i} points={`${cx},${cy-5} ${cx+5},${cy} ${cx},${cy+5} ${cx-5},${cy}`} fill={ring}/>
      ))}
    </svg>
  );
};

const CornerDiamond = ({ flip }: { flip?: string }) => (
  <svg width="38" height="38" viewBox="0 0 38 38" style={{ display:'block', transform:flip }}>
    <polygon points="19,2 36,19 19,36 2,19" fill="none" stroke="#C9A84C" strokeWidth="1.5"/>
    <polygon points="19,7 31,19 19,31 7,19" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="0.7"/>
    <circle cx="19" cy="19" r="2.8" fill="#C9A84C"/>
  </svg>
);

const Diamond = ({ size = 8, color = '#C9A84C' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16"
    style={{ display:'inline-block', verticalAlign:'middle', flexShrink:0 }}>
    <polygon points="8,0 16,8 8,16 0,8" fill={color}/>
  </svg>
);

const BELT_CONFIG = {
  'Blue Belt': {
    label: 'Blue Belt (Professional)',
    bg: 'linear-gradient(170deg, #0A1A4A 0%, #1B2A4A 55%, #0E1F3A 100%)',
    badgeBg: '#1e3a8a', badgeBorder: 'rgba(255,255,255,0.22)', badgeText: '#FFFFFF',
    certTitle: 'Certificate of Achievement',
    ack: 'In recognition of professional dedication, applied mastery, and the resolve to transform knowledge into meaningful impact.',
  },
  'Black Belt': {
    label: 'Black Belt (Mastery)',
    bg: 'linear-gradient(170deg, #0A0800 0%, #1A1400 55%, #0D0A00 100%)',
    badgeBg: '#0D0A00', badgeBorder: 'rgba(201,168,76,0.5)', badgeText: '#C9A84C',
    certTitle: 'Certificate of Mastery',
    ack: 'In recognition of exemplary mastery, outstanding leadership, and an unwavering commitment to excellence in the digital age.',
  },
};

export default function CertificateB({
  candidateName,
  courseName,
  dateIssued,
  certificateCode,
  studentId,
  beltLevel = 'Blue Belt',
  divRef,
}: CertificateBProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const cfg = BELT_CONFIG[beltLevel];
  const isBlack = beltLevel === 'Black Belt';

  useEffect(() => {
    if (!certificateCode) return;
    QRCode.toDataURL(
      `https://cert-ashen.vercel.app/verify/${encodeURIComponent(certificateCode)}`,
      { margin:1, width:100, color:{ dark:'#1B2A4A', light: isBlack ? '#0D0A00' : '#EEF3F8' } }
    ).then(setQrDataUrl);
  }, [certificateCode, isBlack]);

  return (
    <div
      ref={divRef}
      style={{
        width:794, height:1122,
        position:'relative', overflow:'hidden',
        fontFamily:'var(--font-inter), Inter, sans-serif',
        backgroundColor: isBlack ? '#0D0A00' : '#EEF3F8',
        backgroundImage: isBlack
          ? 'radial-gradient(circle, rgba(201,168,76,0.05) 1px, transparent 1px)'
          : 'radial-gradient(circle, rgba(201,168,76,0.07) 1px, transparent 1px)',
        backgroundSize:'28px 28px',
      }}
    >
      {/* Border system */}
      <div style={{ position:'absolute', inset:10, border:`2.5px solid ${isBlack ? '#C9A84C' : '#1B2A4A'}`, pointerEvents:'none', zIndex:6 }}/>
      <div style={{ position:'absolute', inset:17, border:'1.5px solid #C9A84C', pointerEvents:'none', zIndex:6 }}/>
      <div style={{ position:'absolute', inset:23, border:`0.5px solid ${isBlack ? 'rgba(201,168,76,0.25)' : 'rgba(27,42,74,0.2)'}`, pointerEvents:'none', zIndex:6 }}/>

      {/* Corner diamonds */}
      <div style={{ position:'absolute', top:0, left:0, zIndex:9 }}><CornerDiamond/></div>
      <div style={{ position:'absolute', top:0, right:0, zIndex:9 }}><CornerDiamond flip="scale(-1,1)"/></div>
      <div style={{ position:'absolute', bottom:0, left:0, zIndex:9 }}><CornerDiamond flip="scale(1,-1)"/></div>
      <div style={{ position:'absolute', bottom:0, right:0, zIndex:9 }}><CornerDiamond flip="scale(-1,-1)"/></div>

      {/* Header */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:200,
        background: cfg.bg,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2,
      }}>
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 65%)',
        }}/>

        {/* Belt badge */}
        <div style={{
          position:'absolute', top:18, right:30,
          backgroundColor: cfg.badgeBg, border:`1px solid ${cfg.badgeBorder}`,
          color: cfg.badgeText, fontSize:8, fontWeight:800,
          letterSpacing:'3px', textTransform:'uppercase', padding:'5px 13px', zIndex:4,
        }}>
          {cfg.label}
        </div>

        {certificateCode && (
          <div style={{
            position:'absolute', top:20, left:30,
            fontSize:7.5, color:'rgba(255,255,255,0.4)', fontFamily:'Courier, monospace',
            letterSpacing:'1.5px', zIndex:4,
          }}>
            {certificateCode}
          </div>
        )}

        <div style={{ marginBottom:10, position:'relative', zIndex:3 }}>
          <Diamond size={11} color="#C9A84C"/>
        </div>

        <div style={{
          fontFamily:'var(--font-playfair), "Playfair Display", serif',
          fontSize:34, fontWeight:700, color:'#FFFFFF', letterSpacing:'2px', lineHeight:1.1, position:'relative', zIndex:3,
        }}>
          Metabridge Academy
        </div>
        <div style={{
          fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'5px',
          textTransform:'uppercase', marginTop:7, position:'relative', zIndex:3,
        }}>
          Port Harcourt · Nigeria
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8, margin:'10px 0 8px', width:280, position:'relative', zIndex:3 }}>
          <div style={{ flex:1, height:1, background:'linear-gradient(to right, transparent, #C9A84C)' }}/>
          <Diamond size={8} color="#F4891F"/>
          <div style={{ flex:1, height:1, background:'linear-gradient(to left, transparent, #C9A84C)' }}/>
        </div>

        <div style={{
          fontSize:10.5, color:'#F4891F', fontWeight:800, letterSpacing:'6px',
          textTransform:'uppercase', position:'relative', zIndex:3,
        }}>
          {cfg.certTitle}
        </div>
      </div>

      {/* Body */}
      <div style={{
        position:'absolute', top:200, left:0, right:0, bottom:0,
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'28px 60px 20px', zIndex:3,
      }}>
        <div style={{
          fontSize:13, color: isBlack ? '#8C7A4A' : '#4A5B72',
          fontStyle:'italic', marginBottom:10, letterSpacing:'0.5px',
        }}>
          Awarded to
        </div>

        <div style={{
          fontFamily:'var(--font-playfair), "Playfair Display", serif',
          fontSize:46, fontWeight:700, color: isBlack ? '#C9A84C' : '#1B2A4A',
          lineHeight:1.1, textAlign:'center', minHeight:56,
        }}>
          {candidateName || ' '}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'12px 0' }}>
          <div style={{ width:60, height:1.5, background:'linear-gradient(to right, transparent, #C9A84C)' }}/>
          <Diamond size={7} color="#C9A84C"/>
          <div style={{ width:60, height:1.5, background:'linear-gradient(to left, transparent, #C9A84C)' }}/>
        </div>

        <div style={{
          fontSize:12.5, color: isBlack ? '#8C7A4A' : '#4A5B72',
          fontStyle:'italic', marginBottom:6,
        }}>
          In recognition of dedicated commitment and successful completion of the
        </div>

        <div style={{
          fontFamily:'var(--font-playfair), "Playfair Display", serif',
          fontSize:23, fontWeight:700, color: isBlack ? '#E8C96A' : '#1B2A4A',
          marginBottom:4, lineHeight:1.3, textAlign:'center',
        }}>
          {courseName || ' '}
        </div>

        <div style={{
          fontSize:11, color: isBlack ? '#7A6A3A' : '#5E7A96',
          letterSpacing:'0.3px', marginBottom:14,
        }}>
          certification programme at Metabridge Academy
        </div>

        {/* Acknowledgment */}
        <div style={{
          fontSize:11.5, color: isBlack ? '#8C7A4A' : '#4A5B72',
          fontStyle:'italic', textAlign:'center', maxWidth:520, lineHeight:1.75, marginBottom:18,
          padding:'12px 20px',
          borderTop:`0.5px solid ${isBlack ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.4)'}`,
          borderBottom:`0.5px solid ${isBlack ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.4)'}`,
        }}>
          {cfg.ack}
        </div>

        {/* Issued line */}
        <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:11, marginBottom:16 }}>
          <span style={{ color: isBlack ? '#8C7A4A' : '#4A5B72' }}>
            Issued:&nbsp;<strong style={{ color: isBlack ? '#C9A84C' : '#1B2A4A' }}>{dateIssued || ' '}</strong>
          </span>
          {studentId && (
            <>
              <div style={{ width:1, height:14, backgroundColor:'rgba(201,168,76,0.5)' }}/>
              <span style={{ fontFamily:'Courier, monospace', fontSize:10, color: isBlack ? '#7A6A3A' : '#5E7A96', letterSpacing:'2px' }}>
                ID: {studentId}
              </span>
            </>
          )}
        </div>

        {/* Seal */}
        <div style={{ margin:'4px 0 10px' }}>
          <MetabridgeSeal dark={isBlack}/>
        </div>

        {/* Signatures */}
        <div style={{
          width:'100%', display:'flex', justifyContent:'space-around', alignItems:'flex-end',
          paddingTop:10,
        }}>
          <div style={{ textAlign:'center' }}>
            <div style={{
              fontSize:22, fontFamily:'"Dancing Script", "Brush Script MT", cursive',
              color: isBlack ? '#C9A84C' : '#1B2A4A', letterSpacing:'1px', marginBottom:4,
            }}>
              Gideon Owhonda
            </div>
            <div style={{ width:160, height:1, background:'linear-gradient(to right, transparent, #C9A84C, transparent)', margin:'0 auto 6px' }}/>
            <div style={{ fontSize:11.5, fontWeight:700, color: isBlack ? '#C9A84C' : '#1B2A4A', letterSpacing:'0.3px' }}>Gideon Owhonda</div>
            <div style={{ fontSize:9.5, color: isBlack ? '#7A6A3A' : '#5E7A96', marginTop:2 }}>CEO, Metabridge Academy</div>
          </div>

          <div style={{ paddingBottom:8 }}><Diamond size={8} color="rgba(201,168,76,0.4)"/></div>

          <div style={{ textAlign:'center' }}>
            <div style={{
              fontSize:22, fontFamily:'"Dancing Script", "Brush Script MT", cursive',
              color: isBlack ? '#C9A84C' : '#1B2A4A', letterSpacing:'1px', marginBottom:4,
            }}>
              Bright G. Owhonda
            </div>
            <div style={{ width:160, height:1, background:'linear-gradient(to right, transparent, #C9A84C, transparent)', margin:'0 auto 6px' }}/>
            <div style={{ fontSize:11.5, fontWeight:700, color: isBlack ? '#C9A84C' : '#1B2A4A', letterSpacing:'0.3px' }}>Bright G. O</div>
            <div style={{ fontSize:9.5, color: isBlack ? '#7A6A3A' : '#5E7A96', marginTop:2 }}>Lead Instructor, Metabridge Academy</div>
          </div>
        </div>

        {/* QR code */}
        {qrDataUrl && (
          <div style={{ position:'absolute', bottom:14, right:18, textAlign:'center', zIndex:7 }}>
            <img src={qrDataUrl} alt="Scan to verify"
              style={{ width:68, height:68, display:'block', border:'1px solid rgba(201,168,76,0.4)' }}/>
            <div style={{ fontSize:7, color: isBlack ? '#7A6A3A' : '#5E7A96', marginTop:2, letterSpacing:'1px', textTransform:'uppercase' }}>
              Scan to verify
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
