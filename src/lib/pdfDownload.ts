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
    backgroundColor: '#F4F5F0',
    logging: false,
    imageTimeout: 0,
    foreignObjectRendering: false,
    onclone: (_clonedDoc, clonedEl) => {
      // Replace SVG elements with <img> to avoid html2canvas bugs with
      // textPath, defs, and SVGs whose size is CSS-only (reads as 0 in clone)
      const svgs = Array.from(clonedEl.querySelectorAll('svg'));
      svgs.forEach((svg) => {
        // Resolve width/height: SVG attribute → inline style → viewBox → fallback
        const attrW = svg.width?.baseVal?.value || 0;
        const attrH = svg.height?.baseVal?.value || 0;
        const styleW = parseFloat(svg.style.width) || 0;
        const styleH = parseFloat(svg.style.height) || 0;
        const vb = svg.viewBox?.baseVal;
        const vbW = vb ? vb.width : 0;
        const vbH = vb ? vb.height : 0;
        const w = attrW || styleW || vbW || svg.getBoundingClientRect().width || 0;
        const h = attrH || styleH || vbH || svg.getBoundingClientRect().height || 0;

        if (!w || !h) return; // truly unresolvable — skip to avoid 0×0 canvas crash

        const serializer = new XMLSerializer();
        // Stamp resolved dimensions onto the SVG string so the browser renders it at full size
        const svgWithSize = svg.cloneNode(true) as SVGSVGElement;
        svgWithSize.setAttribute('width', String(w));
        svgWithSize.setAttribute('height', String(h));
        const svgStr = serializer.serializeToString(svgWithSize);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = _clonedDoc.createElement('img');
        img.src = url;
        img.width = w;
        img.height = h;
        img.style.cssText = svg.style.cssText;
        svg.parentNode?.replaceChild(img, svg);
      });
    },
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [297, 210] });
  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
  pdf.save(`Metabridge-Certificate-${code.replace(/\//g, '-')}.pdf`);
}
