/**
 * Shared renderer for the public and admin luggage-label pages.
 * The transparent master artwork is hosted as a public project asset;
 * the canvas is deliberately flattened onto white before drawing it so
 * transparent pixels never export as black or transparent patches.
 */
export type LabelKoperData = {
  name: string;
  number: string;
  leader: string;
  phone: string;
  makkah: string;
  madinah: string;
};

const TEMPLATE_URL = "/assets/label-koper-transparan.png";

function wrapText(
  ctx: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function renderLabelKoper(
  canvas: HTMLCanvasElement,
  data: LabelKoperData,
  onError?: (message: string) => void,
): () => void {
  let cancelled = false;
  const image = new Image();
  image.onload = () => {
    if (cancelled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onError?.("Browser tidak dapat menyiapkan preview label.");
      return;
    }

    canvas.width = image.naturalWidth || 400;
    canvas.height = image.naturalHeight || 2000;
    const scaleX = canvas.width / 400;
    const scaleY = canvas.height / 2000;

    // Flatten transparency on white, matching the approved sample output.
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(image, 0, 0, 400, 2000);

    const cream = "#f4e5ca";
    const brown = "#35190d";
    ctx.textBaseline = "alphabetic";

    // Room values sit in the open upper half of each original room frame.
    const drawRoom = (value: string, y: number) => {
      if (!value.trim()) return;
      ctx.save();
      ctx.translate(200, y);
      ctx.rotate(Math.PI);
      ctx.textAlign = "center";
      ctx.fillStyle = brown;
      let size = 26;
      for (const candidate of [26, 23, 20, 18, 16]) {
        ctx.font = `italic 700 ${candidate}px Georgia, serif`;
        size = candidate;
        if (ctx.measureText(value).width <= 230) break;
      }
      ctx.fillText(value.trim(), 0, Math.round(size * 0.35), 230);
      ctx.restore();
    };
    drawRoom(data.makkah, 350);
    drawRoom(data.madinah, 545);

    // Ownership block: use the existing dark panel as-is. No masks, patches,
    // recoloring, or replacement rectangles are painted over the artwork.
    ctx.textAlign = "center";
    ctx.fillStyle = "#c88b42";
    ctx.font = "700 54px Georgia, serif";
    ctx.fillText(data.number.trim() || "—", 200, 1670, 250);

    ctx.fillStyle = cream;
    ctx.font = "700 17px Arial, sans-serif";
    ctx.fillText("BARANG INI MILIK", 200, 1715, 300);
    ctx.font = "italic 15px Arial, sans-serif";
    ctx.fillText("Belongs to", 200, 1734, 260);

    const name = data.name.trim() || "NAMA JAMAAH";
    let nameLines: string[] = [];
    let nameSize = 31;
    for (const candidate of [31, 29, 27, 25, 23, 21, 19]) {
      ctx.font = `700 ${candidate}px Arial, sans-serif`;
      nameLines = wrapText(ctx, name, 330);
      nameSize = candidate;
      if (nameLines.length <= 2) break;
    }
    ctx.font = `700 ${nameSize}px Arial, sans-serif`;
    const nameLineHeight = nameSize + 3;
    const nameStartY = nameLines.length > 1 ? 1784 - nameLineHeight / 2 : 1788;
    nameLines.slice(0, 2).forEach((line, index) => {
      ctx.fillText(line, 200, nameStartY + index * nameLineHeight, 340);
    });

    ctx.fillStyle = cream;
    ctx.font = "700 23px Arial, sans-serif";
    ctx.fillText(data.phone.trim() || "—", 228, 1858, 270);

    // TOUR LEADER caption and divider are already part of the master artwork.
    ctx.font = "700 18px Arial, sans-serif";
    ctx.fillText(data.leader.trim() || "—", 200, 1952, 300);
    ctx.font = "700 16px Arial, sans-serif";
    ctx.fillText(data.phone.trim() || "—", 226, 1985, 270);
    ctx.restore();
  };
  image.onerror = () => {
    if (!cancelled) {
      onError?.("Template transparan tidak dapat dimuat. Periksa akses aset template.");
    }
  };
  image.src = TEMPLATE_URL;
  return () => {
    cancelled = true;
    image.onload = null;
    image.onerror = null;
  };
}
