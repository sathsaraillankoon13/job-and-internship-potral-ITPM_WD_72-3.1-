const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const COLORS = {
  navy: [0.09, 0.14, 0.22],
  blue: [0.16, 0.39, 0.89],
  slate: [0.22, 0.29, 0.36],
  muted: [0.45, 0.52, 0.6],
  border: [0.82, 0.86, 0.91],
  chip: [0.93, 0.96, 1],
  white: [1, 1, 1],
};

const escapePdfText = (value = '') =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');

const measureText = (text, fontSize) =>
  [...String(text)].reduce((total, char) => {
    if (char === ' ') return total + fontSize * 0.28;
    if (/[ilI.,'`]/.test(char)) return total + fontSize * 0.22;
    if (/[A-Z0-9]/.test(char)) return total + fontSize * 0.57;
    return total + fontSize * 0.49;
  }, 0);

const wrapText = (text, width, fontSize) => {
  const paragraphs = String(text)
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) {
    return [];
  }

  const lines = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/);
    let currentLine = '';

    words.forEach((word) => {
      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (!currentLine || measureText(candidate, fontSize) <= width) {
        currentLine = candidate;
        return;
      }

      lines.push(currentLine);
      currentLine = word;
    });

    if (currentLine) {
      lines.push(currentLine);
    }
  });

  return lines;
};

const formatColor = (color) => color.map((value) => value.toFixed(3)).join(' ');

const textOp = (x, top, fontSize, value, font = 'F1', color = COLORS.slate) => {
  const y = PAGE_HEIGHT - top - fontSize;
  return `${formatColor(color)} rg BT /${font} ${fontSize} Tf 1 0 0 1 ${x.toFixed(
    2
  )} ${y.toFixed(2)} Tm (${escapePdfText(value)}) Tj ET`;
};

const rectOp = (x, top, width, height, color) => {
  const y = PAGE_HEIGHT - top - height;
  return `${formatColor(color)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(
    2
  )} ${height.toFixed(2)} re f`;
};

const lineOp = (x1, top1, x2, top2, width, color) => {
  const y1 = PAGE_HEIGHT - top1;
  const y2 = PAGE_HEIGHT - top2;
  return `${formatColor(color)} RG ${width.toFixed(2)} w ${x1.toFixed(2)} ${y1.toFixed(
    2
  )} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`;
};

const renderWrappedText = (operations, options) => {
  const { x, top, width, fontSize, lineHeight, text, font = 'F1', color = COLORS.slate } =
    options;
  const lines = wrapText(text, width, fontSize);

  lines.forEach((line, index) => {
    operations.push(textOp(x, top + index * lineHeight, fontSize, line, font, color));
  });

  return lines.length * lineHeight;
};

const renderSectionTitle = (operations, title, top) => {
  operations.push(textOp(46, top, 11, title.toUpperCase(), 'F2', COLORS.blue));
  operations.push(lineOp(46, top + 16, 549, top + 16, 1, COLORS.border));
  return 28;
};

const renderEntryBlock = (operations, entry, top) => {
  let cursor = top;

  operations.push(textOp(46, cursor, 12, entry.title, 'F2', COLORS.navy));
  cursor += 16;

  const metaLine = [entry.subtitle, entry.meta].filter(Boolean).join(' | ');
  if (metaLine) {
    operations.push(textOp(46, cursor, 10, metaLine, 'F1', COLORS.muted));
    cursor += 14;
  }

  if (entry.detail) {
    cursor += renderWrappedText(operations, {
      x: 58,
      top: cursor,
      width: 475,
      fontSize: 10.5,
      lineHeight: 13,
      text: `- ${entry.detail}`,
      color: COLORS.slate,
    });
  }

  return cursor - top + 6;
};

const renderSkillTags = (operations, skills, top) => {
  let currentX = 46;
  let currentY = top;
  const lineHeight = 28;

  skills.forEach((skill) => {
    const textWidth = measureText(skill, 9.5);
    const tagWidth = Math.min(Math.max(textWidth + 18, 58), 170);

    if (currentX + tagWidth > 549) {
      currentX = 46;
      currentY += lineHeight;
    }

    operations.push(rectOp(currentX, currentY, tagWidth, 20, COLORS.chip));
    operations.push(textOp(currentX + 9, currentY + 4, 9.5, skill, 'F2', COLORS.blue));
    currentX += tagWidth + 8;
  });

  return currentY - top + 28;
};

const estimateEntryHeight = (entry) => {
  let height = 22;

  if (entry.subtitle || entry.meta) {
    height += 14;
  }

  if (entry.detail) {
    const lines = wrapText(`- ${entry.detail}`, 475, 10.5);
    height += lines.length * 13;
  }

  return height + 6;
};

const buildPdfDocument = (pageStreams) => {
  const fontRegularId = 1;
  const fontBoldId = 2;
  const firstPageObjectId = 3;
  const totalPageObjects = pageStreams.length * 2;
  const pagesId = firstPageObjectId + totalPageObjects;
  const catalogId = pagesId + 1;
  const objects = new Array(catalogId + 1).fill('');
  objects[fontRegularId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[fontBoldId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

  const pageRefs = [];

  pageStreams.forEach((stream, index) => {
    const contentId = firstPageObjectId + index * 2;
    const pageId = contentId + 1;
    const contentLength = new TextEncoder().encode(stream).length;

    objects[contentId] = `<< /Length ${contentLength} >>\nstream\n${stream}\nendstream`;
    objects[pageId] =
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> ` +
      `/Contents ${contentId} 0 R >>`;

    pageRefs.push(`${pageId} 0 R`);
  });

  objects[pagesId] = `<< /Type /Pages /Count ${pageStreams.length} /Kids [${pageRefs.join(' ')}] >>`;
  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = new TextEncoder().encode(pdf).length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefStart = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < objects.length; index += 1) {
    const offset = String(offsets[index] || 0).padStart(10, '0');
    pdf += `${offset} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
};

export const buildResumePdfBlob = (resumeData) => {
  const pageStreams = [];
  let operations = [];
  let cursor = 0;
  let pageNumber = 1;

  const startPage = () => {
    operations = [];

    if (pageNumber === 1) {
      operations.push(rectOp(0, 0, PAGE_WIDTH, 122, COLORS.navy));
      operations.push(rectOp(0, 122, PAGE_WIDTH, 10, COLORS.blue));
      operations.push(textOp(46, 34, 28, resumeData.fullName, 'F2', COLORS.white));
      operations.push(textOp(46, 70, 12.5, resumeData.headline, 'F1', COLORS.white));
      operations.push(textOp(46, 92, 10.5, resumeData.contactLine, 'F1', COLORS.white));
      cursor = 154;
    } else {
      operations.push(textOp(46, 28, 17, resumeData.fullName, 'F2', COLORS.navy));
      operations.push(textOp(470, 30, 9.5, `Page ${pageNumber}`, 'F1', COLORS.muted));
      operations.push(lineOp(46, 52, 549, 52, 1, COLORS.border));
      cursor = 74;
    }
  };

  const closePage = () => {
    pageStreams.push(operations.join('\n'));
    pageNumber += 1;
  };

  const ensureSpace = (heightNeeded) => {
    const limit = PAGE_HEIGHT - 56;

    if (cursor + heightNeeded <= limit) {
      return;
    }

    closePage();
    startPage();
  };

  startPage();

  const renderTextSection = (title, text) => {
    const wrappedLines = wrapText(text, 503, 11);
    const estimatedHeight = 28 + wrappedLines.length * 15 + 10;
    ensureSpace(estimatedHeight);
    cursor += renderSectionTitle(operations, title, cursor);
    cursor += renderWrappedText(operations, {
      x: 46,
      top: cursor,
      width: 503,
      fontSize: 11,
      lineHeight: 15,
      text,
      color: COLORS.slate,
    });
    cursor += 12;
  };

  const renderEntrySection = (title, entries) => {
    if (!entries.length) return;

    const estimatedHeight =
      28 + entries.reduce((total, entry) => total + estimateEntryHeight(entry), 0) + 10;
    ensureSpace(Math.min(estimatedHeight, PAGE_HEIGHT - 120));
    cursor += renderSectionTitle(operations, title, cursor);

    entries.forEach((entry) => {
      const height = estimateEntryHeight(entry);
      ensureSpace(height + 10);
      cursor += renderEntryBlock(operations, entry, cursor);
    });

    cursor += 8;
  };

  const renderSkillsSection = (title, skills) => {
    if (!skills.length) return;

    const estimatedRows = Math.ceil(skills.length / 4);
    const estimatedHeight = 28 + estimatedRows * 28 + 12;
    ensureSpace(estimatedHeight);
    cursor += renderSectionTitle(operations, title, cursor);
    cursor += renderSkillTags(operations, skills, cursor);
    cursor += 10;
  };

  renderTextSection('Professional Summary', resumeData.summary);
  renderEntrySection('Experience', resumeData.experience);
  renderEntrySection('Projects', resumeData.projects);
  renderEntrySection('Education', resumeData.education);
  renderSkillsSection('Core Skills', resumeData.skills);
  renderEntrySection('Certifications', resumeData.certifications);

  closePage();

  const pdfContent = buildPdfDocument(pageStreams);
  return new Blob([pdfContent], { type: 'application/pdf' });
};
