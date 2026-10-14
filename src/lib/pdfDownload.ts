import type { RefObject } from 'react';

export async function downloadCertificatePDF(
  certificateRef: RefObject<HTMLDivElement>,
  code: string
): Promise<void> {
  if (!certificateRef.current) return;

  await document.fonts.ready;

  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const canvas = await html2canvas(certificateRef.current, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FEFCF5',
    logging: false,
    imageTimeout: 0,
    foreignObjectRendering: false,
    onclone: (clonedDoc) => {
      // Replace SVG elements with their rasterized equivalents to avoid
      // html2canvas bug where complex SVGs (textPath, defs) create 0×0 canvases
      const svgs = clonedDoc.querySelectorAll('svg');
      svgs.forEach((svg) => {
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = clonedDoc.createElement('img');
        img.src = url;
        img.width = svg.width?.baseVal?.value || svg.getBoundingClientRect().width || 120;
        img.height = svg.height?.baseVal?.value || svg.getBoundingClientRect().height || 120;
        img.style.cssText = svg.style.cssText;
        svg.parentNode?.replaceChild(img, svg);
      });
    },
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, 210] });
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 210);
  pdf.save(`Metabridge-Certificate-${code.replace(/\//g, '-')}.pdf`);
}
