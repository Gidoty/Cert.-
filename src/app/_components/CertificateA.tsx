'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import QRCode from 'qrcode';

const BRIGHT_SIG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAIMAAABVCAYAAABq+ldUAAAIJ0lEQVR42u2dP1AUVxzHP+c4g2iHdEAnZiYFYAXaZIROYirRKv5pAqaTLoIVxjQJpIqQKkgVoTIxVXJ0ApVgmoxHd9iR6whSXYr3W+/durf/727v7feduVnY2917u+/7fv/f21zfp9dQKABO6SNQKBkUSgaFkkGhZFAoGRRKBoWSQaFkUCgZFEoGhZKhlTGkZFA42AP+VTIoHPQoGRQONoH5VmlsTusZ6oYykLO2KhkU0CrSQcnQGCwoGRQAd9WAVDhYtWwIJUMHorsVG61kaAwZLsq2X8nQeXB3ekG2RSVD52ECOFE1oQC4Ahy69p2X7QMlQ2dhEMi79pVku6hkSBffiqvm92lmkqgXeO2x/2dVE+nhjnT0Q2ADmMLE/XMihicwySEw6eNyE8ngZSxOy3ZeyZAMz4BfgFnp/CkhhC2G88C49T0pE+JA2jEecFwX8Nbn+wUlQ3zsAl8CZ4GlkOdsAAPy93oKbdgC+oDbQrqgwFKpxv7MqopWIEM/MCwj/TjGSAa4kUI7xqhORQe1pVaV07Rl9ygZIqJojfQ4aNZIDCLLQ5/vRmlCtPJ0xonwPoVrvM7gfa2J2nMwjsluHgKfANeAfeAIGFEyGHwGbAPvElzjegbv67aQoSz3dgjMAS897BSVDIId2b5McI2JjN/jY2DZY38PcFlthmrdCckTPGsptSeNUPKiy91djuiNdCwZHNdwOME1ukQsk1JHJkFZCDVrxUEy41VkXU18IduzMc9/BjzKwH10A/9ZLuqOy6uYUzIEw9GZcer5h8RIa1aZeo+I+i0hAJiQeSmrDzvrauJCgnP3UjYeo8YrvhO1MAbcF1K6ifAkSw8765NobEMrF/G8d6QbuJnH5BQGROTfFMPWCS7la7T78wBvqIwpiyuomkgfTgg6TSJMUkkuFWWkPw8h8ges9vhhkwzUR55qQyIUU7AT+sX4dGojfqR6/sOyDxFGLXf2IOTv9anNEA2DIYiwR/xAzbiI6vdCqEHxYnLy92rI62zLdrpOtoiSAVNXWMtqL2MKSn7AFMCsixW/Jbo8L/sWgRkPW6AM/IWpQTgjBLhM9CypjZshj5sOcEnnLQmVxnyMIfn0tLIBue8hHYIKV/Yxcf+SGGkXfEZzGIlyICI95yO9nKKWJUxwKex9PrHiDTeAe+INHVkdl/MZEGfl+ItC4mFxZbekTUV5Fge1VFwrkcF+GKOWOHbcyKkIFrkXidYIjlQ6waNciGtvElwRFZbUNmnHXPd9TtqVB15hsrQ77e5aOmSw992NoMvd17U7dJ1KAUwuxLnukjsbi1RyGGEMWTs6WQsnwE8yol/JSD9I+2G3GhkclKjMQ4iDXbzrBMohOrEcoFZsVREXf4g7qwZkEIETEgEhQlncRy81VK5heDlJpTHxOrxK9OMQwdHhTqRyshkPNutk2KvRWWngLiZ3cSBifYvqukV3J+9RXarWZbVxTYxFu05yj0oZv/PZtM6fpbrMHz6ehdVQZD0CWSBZ+trBJPC1dFaPR8Bn0WfELgMvLKNsV9oURMzHrv9fAlcDVMAt4td6tj0ZfhXDroT/DKlBcaluiQUfFNE7Af6RjvYqLnHyEOd9VEwQznnYIkF5ius+ZJ6Q5/C4U8mwYfnRiCi/LQZcmOlza2J9L0f83TCVVUPAG5/vj1zGZBgV1+VBSIe8r0SyLFCntHzWyeAuCB2zHu6JuJUvxMc+TvF3w0QPrwSQYd0i9FSE314BvvLxKlaozBxrSzKUMTH6afG7N6hd0NKIYpVrBNdNXgxxnUchxbq9zvS4qIR8jWMXqNOiH832JvotfXrDCsJ8QyVJ5Pa/GxXbCIpGjoS4lh8R7kiHlzGFMLb9k09IwpaUDHZoddWy4Gulh4fr3J7FCNInTFvei+2wKqO5iKlxGBC1tuoS92EM06N2JcMGlRTxE9GzRfEiti1/fdhyA+uFeYk3hB15QcGlJblel0iBObmnpK7jQLt7EwXLyOrGFJM0ShqMYqqwuyPaI0G5gVnCZy2j4F4nuZbHVOZH5vg4QzkeoFPDYFwkwVW8U+Nh0Kwq57olk7Iajj60jKkdqtdkGBYyrBBtqZ4eUUNOIYtjswzGbGMzJ/TWxZDOctYyLyO3lms5AzyVETpHdWCpR0b+iNgAfdZodh8b1+Pwq2iO+1qBMOfVrZq6Fd43YUfinA7Ni+vp1/gT4Dfge2IWeyTotHqRYVykWq7TJIOXoddruWa9ok4OMaHaS0KcPsKXsbUaGcqEq8hqezJEwQwm6TNNHSqCmkSGftKZBtByBmRSLAsRtklncS8bg3Vqc5AxXMRkPVEyRMeBjKanYmyltUyvvdZkmrgTYEwvkWzRko4mg/0gB2VkFUi+8tt1TO4kbVyqsb+ACYjN1vtBddLa0RtCil5MDiLuhJQ/6+CdgHf1U1kM5IYs59PJrzIcktG4WodrxzEgy1TqF5yimKi1ECoZYuKNRYS0jcIT4lU4b4lt8xZTsDvVyAeiLzn92KJPI+ewInGRkYiS4UO/NOPm9X0T1XCIMJpQWkxjcihhpMOgRYT7NPHtuEoGb+xYVnxcjAG/U/t1ApOYeRpvXfGRpuG09rsvjhOojx1MQulviSE8F7XhzN3Yx+RWdsjI+7KVDNHUR1QUMOs9OKqnyMch8pms3KSSIR665VOKKCm84hNPG+01qM2QvvooWcSIi13MqnQbSob2siuixivW5dzMvAVXyZAuCjViFz2WFHmAKaEv0eBV49VmaD76MROCB6hM5D2TxYYqGeqPN/jPycwMVE0oPuB/hdLP/seZQHsAAAAASUVORK5CYII=';

interface CertificateAProps {
  candidateName: string;
  courseName: string;
  dateIssued: string;
  certificateCode: string;
  divRef?: RefObject<HTMLDivElement>;
}

// Diagonal "METABRIDGE ACADEMY" watermark
const Watermark = ({ id }: { id: string }) => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id={id} x="0" y="0" width="320" height="130" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
        <text x="10" y="55" fontSize="13" fontFamily="Inter, Arial, sans-serif" fontWeight="700"
          fill="#1B2A4A" opacity="0.055" letterSpacing="5">
          METABRIDGE ACADEMY
        </text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

// Subtle dot-grid background for the body (tech aesthetic)
const DotGrid = () => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="dotgrid-a" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="14" cy="14" r="1.2" fill="#1B2A4A" opacity="0.08" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dotgrid-a)" />
  </svg>
);

// Elaborate circuit-trace corner ornament
const CircuitCorner = () => (
  <svg
    width="160"
    height="120"
    viewBox="0 0 160 120"
    style={{ position: 'absolute', bottom: 8, right: 8, opacity: 0.14, zIndex: 2 }}
  >
    <line x1="0" y1="90" x2="80" y2="90" stroke="#29B6D8" strokeWidth="1" />
    <line x1="80" y1="90" x2="80" y2="35" stroke="#29B6D8" strokeWidth="1" />
    <line x1="80" y1="35" x2="160" y2="35" stroke="#29B6D8" strokeWidth="1" />
    <circle cx="80" cy="90" r="4" fill="#29B6D8" />
    <circle cx="80" cy="35" r="4" fill="#29B6D8" />
    <line x1="25" y1="120" x2="25" y2="65" stroke="#29B6D8" strokeWidth="1" />
    <line x1="25" y1="65" x2="120" y2="65" stroke="#29B6D8" strokeWidth="1" />
    <circle cx="25" cy="65" r="3" fill="#29B6D8" />
    <circle cx="120" cy="65" r="3" fill="#29B6D8" />
    <line x1="50" y1="120" x2="50" y2="110" stroke="#C9A84C" strokeWidth="1" />
    <line x1="50" y1="110" x2="140" y2="110" stroke="#C9A84C" strokeWidth="1" />
    <circle cx="50" cy="110" r="2.5" fill="#C9A84C" />
    <circle cx="140" cy="110" r="2.5" fill="#C9A84C" />
    <line x1="110" y1="0" x2="110" y2="35" stroke="#C9A84C" strokeWidth="1" />
    <circle cx="110" cy="35" r="2" fill="#C9A84C" />
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
      `${window.location.origin}/verify/${certificateCode}`,
      {
        margin: 1,
        width: 100,
        color: { dark: '#0D1B35', light: '#F5F2E8' },
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
        backgroundColor: '#F5F2E8',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}
    >
      {/* ── Watermark ── */}
      <Watermark id="wm-a" />

      {/* ── Dot-grid background ── */}
      <DotGrid />

      {/* ── Gold left accent bar ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          background: 'linear-gradient(to bottom, #C9A84C, #8B6914)',
          zIndex: 10,
        }}
      />

      {/* ── Header band ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          background: 'linear-gradient(135deg, #0D1B35 0%, #1B2A4A 60%, #1E4A6B 100%)',
          zIndex: 3,
        }}
      >
        {/* Subtle cyan sheen on right side */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(to left, rgba(41,182,216,0.08) 0%, transparent 100%)',
          }}
        />

        {/* Gold underline rule at bottom of header */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 10,
            right: 0,
            height: 2,
            background: 'linear-gradient(to right, #C9A84C, #E8C96A, transparent)',
          }}
        />

        {/* Header text — centred */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            Gateway to Digital Literacy
          </div>
          <div
            style={{
              width: 200,
              height: 1,
              background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
              margin: '10px 0',
              opacity: 0.7,
            }}
          />
          {/* Crimson badge for certificate type */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#8B1A1A', borderRadius: 2, padding: '4px 14px', marginTop: 6,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C' }} />
            <span style={{ fontSize: 10, color: '#FFFFFF', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>
              Certificate of Completion
            </span>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C' }} />
          </div>
        </div>

        {/* Certificate code — top right inside header */}
        {certificateCode && (
          <div
            style={{
              position: 'absolute',
              top: 85,
              right: 24,
              color: 'rgba(255,255,255,0.75)',
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
          inset: 7,
          border: '2.5px solid #1B2A4A',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* ── Gold mid border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 13,
          border: '1px solid rgba(201,168,76,0.6)',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* ── Cyan inner border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 18,
          border: '1px solid rgba(41,182,216,0.25)',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* ── Circuit corner decoration ── */}
      <CircuitCorner />

      {/* ── Body content ── */}
      <div
        style={{
          position: 'absolute',
          top: HEADER_H,
          left: 10,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '30px 70px 18px',
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
              marginBottom: 14,
              letterSpacing: '0.5px',
            }}
          >
            This is to certify that
          </div>

          <div
            style={{
              fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              fontSize: 44,
              fontWeight: 700,
              color: '#0D1B35',
              lineHeight: 1.2,
              minHeight: 58,
            }}
          >
            {candidateName || ' '}
          </div>

          {/* Gold rule under name */}
          <div
            style={{
              width: 120,
              height: 2,
              background: 'linear-gradient(to right, #C9A84C, #E8C96A, #C9A84C)',
              margin: '12px auto 14px',
              borderRadius: 1,
            }}
          />

          <div
            style={{
              fontSize: 13,
              color: '#1E6B7A',
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
              marginBottom: 4,
            }}
          >
            {courseName || ' '}
          </div>

          <div style={{ fontSize: 12, color: '#2B8A9C' }}>
            training programme conducted by Metabridge Academy
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: '#1E6B7A' }}>
              Issued: {dateIssued || ' '}
            </div>
          </div>
        </div>

        {/* Signature */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid rgba(201,168,76,0.4)',
            paddingTop: 14,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${BRIGHT_SIG_B64}`}
              alt=""
              style={{
                width: 130,
                height: 'auto',
                display: 'block',
                margin: '0 auto 2px',
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
            bottom: 20,
            right: 22,
            textAlign: 'center',
            zIndex: 7,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Scan to verify"
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
