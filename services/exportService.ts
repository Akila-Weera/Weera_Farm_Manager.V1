
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)).join(','))
  ];

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = (data: any[], title: string, filename: string) => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF() as any;
  const dateStr = new Date().toLocaleString();

  // Header Branding - Professional Design
  // Deep green bar at top
  doc.setFillColor(61, 99, 77); // #3d634d
  doc.rect(0, 0, 210, 40, 'F');

  // Company Name
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('WEERA AGRICULTURE', 14, 20);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('(PVT) LTD - Management Division', 14, 28);
  
  // Website
  doc.setTextColor(230, 230, 230);
  doc.text('www.weera.lk', 170, 20);

  // Report Specific Info
  doc.setTextColor(26, 28, 30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 55);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${dateStr}`, 14, 62);
  doc.text('Document ID: WEERA-' + Math.random().toString(36).substr(2, 9).toUpperCase(), 14, 67);
  
  doc.setDrawColor(230, 230, 230);
  doc.line(14, 72, 196, 72);

  const headers = Object.keys(data[0]);
  const rows = data.map(item => headers.map(header => {
    const val = item[header];
    if (typeof val === 'number') return val.toLocaleString();
    return val;
  }));

  doc.autoTable({
    startY: 78,
    head: [headers.map(h => h.replace(/([A-Z])/g, ' $1').toUpperCase())],
    body: rows,
    theme: 'grid',
    headStyles: { 
      fillColor: [61, 99, 77], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    styles: { 
      fontSize: 8, 
      cellPadding: 4,
      textColor: [50, 50, 50],
      lineColor: [240, 240, 240],
      lineWidth: 0.1,
    },
    columnStyles: {
      id: { cellWidth: 20 },
    },
    alternateRowStyles: {
      fillColor: [250, 252, 251]
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 14, 285);
    doc.text('Confidential - WEERA AGRICULTURE (PVT) LTD', 140, 285);
  }

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const syncToGoogleSheets = async (url: string, payload: any) => {
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('Sync Error:', error);
    throw error;
  }
};
