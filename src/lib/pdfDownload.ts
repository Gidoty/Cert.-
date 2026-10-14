import type { RefObject } from 'react';

export async function downloadCertificatePDF(
  certificateRef: RefObject<HTMLDivElement>,
  code: string
): Promise<void> {
  if (!certificateRef.current) return;

  await document.fonts.ready;

  const { toPng } = await import('html-to-image');
  const { jsPDF } = await import('jspdf');

  const dataUrl = await toPng(certificateRef.current, {
    pixelRatio: 2,
    backgroundColor: '#FEFCF5',
    skipFonts: false,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, 210] });
  pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 210);
  pdf.save(`Metabridge-Certificate-${code.replace(/\//g, '-')}.pdf`);
}
