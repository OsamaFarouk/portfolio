const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Dimensions: 1200 x 630
const width = 1200;
const height = 630;

// Create raw RGBA buffer (width * height * 4)
const rawBuffer = Buffer.alloc(width * height * 4);

// Helper function to draw a filled rectangle
function drawRect(x, y, w, h, r, g, b, a = 255) {
  const startX = Math.max(0, Math.floor(x));
  const endX = Math.min(width, Math.floor(x + w));
  const startY = Math.max(0, Math.floor(y));
  const endY = Math.min(height, Math.floor(y + h));

  for (let py = startY; py < endY; py++) {
    for (let px = startX; px < endX; px++) {
      const idx = (py * width + px) * 4;
      rawBuffer[idx] = r;
      rawBuffer[idx + 1] = g;
      rawBuffer[idx + 2] = b;
      rawBuffer[idx + 3] = a;
    }
  }
}

// Simple 8x13 Bitmap Font for crisp terminal text rendering
const FONT_CHAR_WIDTH = 8;
const FONT_CHAR_HEIGHT = 13;

// Minimal 8x13 font bitmap definitions for alphanumeric & basic symbols
const fontBitmaps = {
  'A': [0x18,0x3c,0x66,0x66,0x7e,0x66,0x66,0x66,0x66,0x00],
  'B': [0x7c,0x66,0x66,0x7c,0x66,0x66,0x66,0x7c,0x00],
  'C': [0x3c,0x66,0x60,0x60,0x60,0x60,0x66,0x3c,0x00],
  'D': [0x78,0x6c,0x66,0x66,0x66,0x66,0x6c,0x78,0x00],
  'E': [0x7e,0x60,0x60,0x7c,0x60,0x60,0x60,0x7e,0x00],
  'F': [0x7e,0x60,0x60,0x7c,0x60,0x60,0x60,0x60,0x00],
  'G': [0x3c,0x66,0x60,0x6e,0x66,0x66,0x66,0x3a,0x00],
  'H': [0x66,0x66,0x66,0x7e,0x66,0x66,0x66,0x66,0x00],
  'I': [0x3c,0x18,0x18,0x18,0x18,0x18,0x18,0x3c,0x00],
  'J': [0x1e,0x0c,0x0c,0x0c,0x0c,0x6c,0x6c,0x38,0x00],
  'K': [0x66,0x6c,0x78,0x70,0x78,0x6c,0x66,0x66,0x00],
  'L': [0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x7e,0x00],
  'M': [0x63,0x77,0x7f,0x6b,0x63,0x63,0x63,0x63,0x00],
  'N': [0x66,0x76,0x7e,0x7e,0x6e,0x66,0x66,0x66,0x00],
  'O': [0x3c,0x66,0x66,0x66,0x66,0x66,0x66,0x3c,0x00],
  'P': [0x7c,0x66,0x66,0x7c,0x60,0x60,0x60,0x60,0x00],
  'Q': [0x3c,0x66,0x66,0x66,0x66,0x6e,0x3c,0x0e,0x00],
  'R': [0x7c,0x66,0x66,0x7c,0x78,0x6c,0x66,0x66,0x00],
  'S': [0x3c,0x66,0x60,0x3c,0x06,0x06,0x66,0x3c,0x00],
  'T': [0x7e,0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x00],
  'U': [0x66,0x66,0x66,0x66,0x66,0x66,0x66,0x3c,0x00],
  'V': [0x66,0x66,0x66,0x66,0x66,0x3c,0x18,0x18,0x00],
  'W': [0x63,0x63,0x63,0x63,0x6b,0x7f,0x77,0x63,0x00],
  'X': [0x66,0x66,0x3c,0x18,0x18,0x3c,0x66,0x66,0x00],
  'Y': [0x66,0x66,0x66,0x3c,0x18,0x18,0x18,0x18,0x00],
  'Z': [0x7e,0x06,0x0c,0x18,0x30,0x60,0x60,0x7e,0x00],
  '0': [0x3c,0x66,0x6e,0x76,0x66,0x66,0x66,0x3c,0x00],
  '1': [0x18,0x38,0x18,0x18,0x18,0x18,0x18,0x3c,0x00],
  '2': [0x3c,0x66,0x06,0x0c,0x18,0x30,0x60,0x7e,0x00],
  '3': [0x3c,0x66,0x06,0x1c,0x06,0x06,0x66,0x3c,0x00],
  '4': [0x0c,0x1c,0x3c,0x6c,0xfe,0x0c,0x0c,0x0c,0x00],
  '5': [0x7e,0x60,0x7c,0x06,0x06,0x06,0x66,0x3c,0x00],
  '6': [0x3c,0x60,0x60,0x7c,0x66,0x66,0x66,0x3c,0x00],
  '7': [0x7e,0x06,0x0c,0x18,0x18,0x18,0x18,0x18,0x00],
  '8': [0x3c,0x66,0x66,0x3c,0x66,0x66,0x66,0x3c,0x00],
  '9': [0x3c,0x66,0x66,0x3e,0x06,0x06,0x0c,0x38,0x00],
  '|': [0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x18,0x00],
  '-': [0x00,0x00,0x00,0x7e,0x00,0x00,0x00,0x00,0x00],
  ':': [0x00,0x18,0x18,0x00,0x00,0x18,0x18,0x00,0x00],
  '/': [0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x00,0x00],
  '[': [0x3c,0x30,0x30,0x30,0x30,0x30,0x30,0x3c,0x00],
  ']': [0x3c,0x0c,0x0c,0x0c,0x0c,0x0c,0x0c,0x3c,0x00],
  '>': [0x60,0x30,0x18,0x0c,0x18,0x30,0x60,0x00,0x00],
  '<': [0x06,0x0c,0x18,0x30,0x18,0x0c,0x06,0x00,0x00],
  '$': [0x18,0x3e,0x60,0x3c,0x06,0x7c,0x18,0x00,0x00],
  '@': [0x3c,0x66,0x6e,0x6e,0x6e,0x60,0x3c,0x00,0x00],
  '.': [0x00,0x00,0x00,0x00,0x00,0x18,0x18,0x00,0x00],
  '=': [0x00,0x7e,0x00,0x7e,0x00,0x00,0x00,0x00,0x00],
  '•': [0x00,0x18,0x3c,0x3c,0x18,0x00,0x00,0x00,0x00],
  ' ': [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00],
};

function drawText(text, startX, startY, scale = 2, color = [255, 255, 255]) {
  const upperText = text.toUpperCase();
  let currentX = startX;

  for (let i = 0; i < upperText.length; i++) {
    const char = upperText[i];
    const bitmap = fontBitmaps[char] || fontBitmaps[' '];

    for (let row = 0; row < bitmap.length; row++) {
      const line = bitmap[row];
      for (let col = 0; col < 8; col++) {
        if ((line & (1 << (7 - col))) !== 0) {
          drawRect(
            currentX + col * scale,
            startY + row * scale,
            scale,
            scale,
            color[0],
            color[1],
            color[2]
          );
        }
      }
    }
    currentX += 8 * scale + scale;
  }
}

// 1. Background Fill (Dark Navy Theme: #0b0f19 -> 11, 15, 25)
drawRect(0, 0, width, height, 11, 15, 25);

// 2. Subtle Grid Background Lines
for (let x = 0; x < width; x += 40) {
  drawRect(x, 0, 1, height, 18, 25, 40);
}
for (let y = 0; y < height; y += 40) {
  drawRect(0, y, width, 1, 18, 25, 40);
}

// 3. Outer Glowing Card Container (#0e1726 with Cyan Border #06b6d4)
drawRect(40, 40, 1120, 550, 14, 23, 38);
// Border
drawRect(40, 40, 1120, 2, 6, 182, 212);
drawRect(40, 588, 1120, 2, 6, 182, 212);
drawRect(40, 40, 2, 550, 6, 182, 212);
drawRect(1158, 40, 2, 550, 6, 182, 212);

// 4. Terminal Header Bar (#151d30)
drawRect(42, 42, 1116, 44, 21, 29, 48);
drawRect(42, 85, 1116, 1, 30, 41, 65);

// Window control dots (Red, Yellow, Green)
drawRect(64, 58, 12, 12, 239, 68, 68);
drawRect(84, 58, 12, 12, 234, 179, 8);
drawRect(104, 58, 12, 12, 34, 197, 94);

// Header Title
drawText("OSAMA INFRASTRUCTURE CONTROL CONSOLE [v1.3.4-STABLE]", 132, 58, 1.3, [6, 182, 212]);

// 5. Main Title & Subtitle
// Main Name: OSAMA FAROUK
drawText("OSAMA FAROUK", 80, 125, 5, [255, 255, 255]);

// Subtitle: DEVOPS & CLOUD INFRASTRUCTURE ENGINEER
drawText("DEVOPS & CLOUD INFRASTRUCTURE ENGINEER", 80, 205, 2.5, [6, 182, 212]);

// 6. Terminal Output Console Box (#070a12)
drawRect(80, 265, 1040, 170, 7, 10, 18);
drawRect(80, 265, 1040, 1, 30, 41, 65);
drawRect(80, 434, 1040, 1, 30, 41, 65);
drawRect(80, 265, 1, 170, 30, 41, 65);
drawRect(1119, 265, 1, 170, 30, 41, 65);

// Console Prompt Lines
drawText("> OSAMA@CONTROL-PLANE:~$ KUBECTL GET NODES --STATUS=READY", 100, 290, 1.8, [50, 215, 75]);
drawText("STATUS: 05/05 CLUSTER NODES ONLINE | ALL SYSTEMS OPERATIONAL", 100, 325, 1.6, [226, 232, 240]);
drawText("EXPERIENCE: 5+ YEARS | AWS SAA-C03 | KUBERNETES CKA CERTIFIED", 100, 355, 1.6, [148, 163, 184]);
drawText("PRIMARY FOCUS: AWS, KUBERNETES, TERRAFORM IaC, CI/CD, OBSERVABILITY", 100, 385, 1.6, [249, 115, 22]);

// 7. Feature Badges at Bottom
const badges = [
  { label: "AWS CLOUD", color: [249, 115, 22] },
  { label: "KUBERNETES CKA", color: [50, 215, 75] },
  { label: "TERRAFORM IaC", color: [6, 182, 212] },
  { label: "CI/CD AUTOMATION", color: [168, 85, 247] },
  { label: "OBSERVABILITY", color: [234, 179, 8] },
];

let badgeX = 80;
badges.forEach((b) => {
  const bWidth = b.label.length * 15 + 24;
  drawRect(badgeX, 470, bWidth, 38, 17, 24, 39);
  // Border
  drawRect(badgeX, 470, bWidth, 1, b.color[0], b.color[1], b.color[2]);
  drawRect(badgeX, 507, bWidth, 1, b.color[0], b.color[1], b.color[2]);
  drawRect(badgeX, 470, 1, 38, b.color[0], b.color[1], b.color[2]);
  drawRect(badgeX + bWidth - 1, 470, 1, 38, b.color[0], b.color[1], b.color[2]);

  drawText(b.label, badgeX + 12, 481, 1.5, b.color);
  badgeX += bWidth + 16;
});

// Footer Domain Tag
drawText("HTTPS://OSAMAFAROUK.COM", 80, 535, 1.8, [6, 182, 212]);

// Convert Raw RGBA Buffer to PNG Format
function createPng(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines with filter byte 0 (None)
  const scanlineLength = width * 4 + 1;
  const rawScanlines = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const lineStart = y * scanlineLength;
    rawScanlines[lineStart] = 0; // Filter: 0
    rgbaBuffer.copy(rawScanlines, lineStart + 1, y * width * 4, (y + 1) * width * 4);
  }

  // Compress using zlib
  const compressedData = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(4 + 4 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcBuf = chunk.slice(4, 8 + length);
  const crcVal = crc32(crcBuf);
  chunk.writeUInt32BE(crcVal, 8 + length);

  return chunk;
}

// CRC32 Table & Calculator
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate PNG & Save to public/og-image.png
const pngData = createPng(width, height, rawBuffer);
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
fs.writeFileSync(outputPath, pngData);

console.log(`[OG IMAGE GENERATOR] Successfully created ${outputPath} (${width}x${height}px, ${pngData.length} bytes)`);
