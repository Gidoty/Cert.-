import type { RefObject } from 'react';

export async function downloadCertificatePDF(
  certificateRef: RefObject<HTMLDivElement>,
  code: string
): Promise<void> {
  if (!certificateRef.current) return;

  await document.fonts.ready;

  const { toJpeg } = await import('html-to-image');
  const { jsPDF } = await import('jspdf');

  const dataUrl = await toJpeg(certificateRef.current, {
    quality: 1.0,
    pixelRatio: 2,
    backgroundColor: '#F4F5F0',
    skipFonts: false,
  });

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [297, 210] });
  pdf.addImage(dataUrl, 'JPEG', 0, 0, 297, 210);
  pdf.save(`Metabridge-Certificate-${code.replace(/\//g, '-')}.pdf`);
}
