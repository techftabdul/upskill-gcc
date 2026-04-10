import { jsPDF } from 'jspdf';

/**
 * Download AI-generated text as a styled PDF.
 * Shared across CV Optimizer and Dashboard.
 */
export const downloadAsPDF = (text, targetRole, targetCountry, filename) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;

  // ─── Header ─────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Optimized CV', margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Target Role: ${targetRole || 'General'} | Country: ${targetCountry || 'GCC'}`,
    margin,
    28
  );

  // ─── Body ───────────────────────────────────────────
  doc.setTextColor(0);
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, maxWidth);

  // Handle multi-page overflow
  let y = 40;
  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 6;
  }

  // ─── Save ───────────────────────────────────────────
  const safeName = filename
    || `optimized-cv-${(targetCountry || 'gcc').replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(safeName);
};
