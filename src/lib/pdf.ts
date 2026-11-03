import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { site } from "@/config/site";
import { formatDateBr, formatDateTimeBr, formatMoney } from "@/lib/money";
import { blank, orderCode, statusLabels, type ServiceOrder } from "@/lib/orders-shared";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;

function sanitize(value: string) {
  return value
    .replace(/[\u00A0\u202F\u2009]/g, " ")
    .replaceAll("\u2014", "-")
    .replaceAll("\u2013", "-")
    .replaceAll("\u201C", '"')
    .replaceAll("\u201D", '"')
    .replaceAll("\u2018", "'")
    .replaceAll("\u2019", "'")
    .replace(/[^\n\x20-\x7E\u00A1-\u00FF]/g, "");
}

function wrapLine(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = sanitize(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let current = "";

  function pushWord(word: string) {
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
      return;
    }
    let chunk = "";
    for (const char of word) {
      const next = chunk + char;
      if (font.widthOfTextAtSize(next, size) > maxWidth && chunk) {
        lines.push(chunk);
        chunk = char;
      } else {
        chunk = next;
      }
    }
    current = chunk;
  }

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && font.widthOfTextAtSize(next, size) > maxWidth) {
      lines.push(current);
      pushWord(word);
    } else if (!current) {
      pushWord(word);
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildOrderPdf(order: ServiceOrder) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;
  const maxWidth = PAGE_WIDTH - MARGIN * 2;
  const code = orderCode(order);
  const ink = rgb(0.12, 0.11, 0.1);
  const muted = rgb(0.33, 0.31, 0.28);
  const gold = rgb(0.45, 0.34, 0.12);

  function newPage() {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
    drawLine(`${site.name} · ${code}`, 9, bold, muted);
    y -= 8;
  }

  function ensure(height: number) {
    if (y - height < MARGIN) newPage();
  }

  function drawLine(value: string, size: number, face: PDFFont, color = ink) {
    const lines = wrapLine(value, face, size, maxWidth);
    for (const line of lines) {
      ensure(size + 5);
      page.drawText(line, { x: MARGIN, y: y - size, size, font: face, color });
      y -= size + 4;
    }
  }

  function gap(amount = 10) {
    y -= amount;
  }

  function section(title: string) {
    gap(8);
    ensure(22);
    page.drawRectangle({
      x: MARGIN,
      y: y - 16,
      width: maxWidth,
      height: 18,
      color: rgb(0.96, 0.94, 0.9),
    });
    page.drawText(sanitize(title), {
      x: MARGIN + 8,
      y: y - 12,
      size: 10,
      font: bold,
      color: gold,
    });
    y -= 24;
  }

  function field(label: string, value: string) {
    drawLine(label, 9, bold, muted);
    drawLine(blank(value), 11, font, ink);
    gap(4);
  }

  drawLine(site.name.toUpperCase(), 18, bold, ink);
  drawLine("Cobertura aérea de eventos", 11, font, muted);
  drawLine(`${site.location} · ${site.phoneDisplay} · ${site.email}`, 10, font, muted);
  gap(12);
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: gold,
  });
  gap(16);
  drawLine(`ORDEM DE SERVIÇO  ${code}`, 16, bold, ink);
  drawLine(
    `Emitida em ${formatDateTimeBr(order.createdAt)} · Status: ${statusLabels[order.status]}`,
    10,
    font,
    muted,
  );

  section("CONTRATANTE");
  field("Nome", order.clientName);
  field("Documento", order.clientDocument);
  field("E-mail", order.clientEmail);
  field("Telefone", order.clientPhone);

  section("EVENTO");
  field("Nome", order.eventName);
  field("Tipo", order.eventType);
  field("Data", formatDateBr(order.eventDate));
  field(
    "Horário",
    [order.startTime, order.endTime].filter(Boolean).join(" às ") || "",
  );
  field("Local", order.address);
  field("Cidade", order.city);

  section("SERVIÇO");
  field("Descrição", order.description);
  field("Entregas", order.deliverables);
  field("Equipamento", order.equipment);
  field("Equipe", order.team);

  section("VALORES");
  field("Valor total", formatMoney(order.amountCents));
  field("Sinal", formatMoney(order.depositCents));
  field("Saldo", formatMoney(Math.max(order.amountCents - order.depositCents, 0)));
  field("Forma de pagamento", order.paymentTerms);

  section("OBSERVAÇÕES");
  field("Notas", order.notes);

  gap(18);
  ensure(90);
  drawLine(
    "O voo depende das condições do tempo, da autorização do local e das regras da ANAC.",
    9,
    font,
    muted,
  );
  gap(28);
  const signatureY = y;
  const column = (maxWidth - 24) / 2;
  drawSignature(page, font, MARGIN, signatureY, column, "Contratante");
  drawSignature(page, font, MARGIN + column + 24, signatureY, column, site.name);

  const bytes = await doc.save();
  return bytes;
}

function drawSignature(page: PDFPage, font: PDFFont, x: number, y: number, width: number, label: string) {
  page.drawLine({
    start: { x, y },
    end: { x: x + width, y },
    thickness: 0.8,
    color: rgb(0.2, 0.18, 0.16),
  });
  page.drawText(sanitize(label), {
    x,
    y: y - 16,
    size: 10,
    font,
    color: rgb(0.2, 0.18, 0.16),
  });
}
