import type { RefObject } from 'react';

export async function downloadCertificatePDF(
  certificateRef: RefObject<HTMLDivElement>,
  code: string
): Promise<void> {
  if (!certificateRef.current) {
    console.error('downloadCertificatePDF: certificateRef.current is null');
    return;
  }

  try {
    await document.fonts.ready;

    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FDF8EE',
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
    pdf.save(`Metabridge-Certificate-${code.replace(/\//g, '-')}.pdf`);
  } catch (err) {
    console.error('downloadCertificatePDF error:', err);
    throw err;
  }
}
