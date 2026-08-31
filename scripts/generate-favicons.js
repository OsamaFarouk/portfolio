const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Helper to create PNG buffers of arbitrary dimensions with terminal prompt symbol `>_`
function generateIconPng(dim) {
  const width = dim;
  const height = dim;
  const rawBuffer = Buffer.alloc(width * height * 4);

  // Background: Dark Navy (#0b0f19)
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const idx = (py * width + px) * 4;
      // Border: Cyan if near edge
      if (px === 0 || px === width - 1 || py === 0 || py === height - 1) {
        rawBuffer[idx] = 6;
        rawBuffer[idx + 1] = 182;
        rawBuffer[idx + 2] = 212;
        rawBuffer[idx + 3] = 255;
      } else {
        rawBuffer[idx] = 11;
        rawBuffer[idx + 1] = 15;
        rawBuffer[idx + 2] = 25;
        rawBuffer[idx + 3] = 255;
      }
    }
  }

  // Draw `>` symbol in Cyan (#06b6d4)
  const scale = Math.max(1, Math.floor(dim / 16));
  const cx = Math.floor(dim * 0.25);
  const cy = Math.floor(dim * 0.25);
  const size = Math.floor(dim * 0.5);

  // Simple > shape logic
  for (let i = 0; i <= size / 2; i++) {
    for (let t = 0; t < scale; t++) {
      // Top diagonal
      drawPixel(cx + i, cy + i + t, [6, 182, 212]);
      // Bottom diagonal
      drawPixel(cx + i, cy + size - i + t, [6, 182, 212]);
    }
  }

  // Draw `_` cursor in Emerald (#32d74b)
  const underlineX = Math.floor(dim * 0.6);
  const underlineY = Math.floor(dim * 0.7);
  const underlineLength = Math.floor(dim * 0.25);
  for (let x = underlineX; x < underlineX + underlineLength; x++) {
    for (let t = 0; t < scale; t++) {
      drawPixel(x, underlineY + t, [50, 215, 75]);
    }
  }

  function drawPixel(px, py, col) {
    if (px >= 0 && px < width && py >= 0 && py < height) {
      const idx = (py * width + px) * 4;
      rawBuffer[idx] = col[0];
      rawBuffer[idx + 1] = col[1];
      rawBuffer[idx + 2] = col[2];
      rawBuffer[idx + 3] = 255;
    }
  }

  return createPng(width, height, rawBuffer);
}

function createPng(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdr);
  const scanlineLength = width * 4 + 1;
  const rawScanlines = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const lineStart = y * scanlineLength;
    rawScanlines[lineStart] = 0;
    rgbaBuffer.copy(rawScanlines, lineStart + 1, y * width * 4, (y + 1) * width * 4);
  }

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

// Generate Icons
const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), generateIconPng(16));
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), generateIconPng(32));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateIconPng(180));
fs.writeFileSync(path.join(publicDir, 'icon.png'), generateIconPng(192));
fs.writeFileSync(path.join(publicDir, 'icon-512x512.png'), generateIconPng(512));

// Generate valid ICO format for favicon.ico
function generateIco(png32Buffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry[0] = 32; // Width
  dirEntry[1] = 32; // Height
  dirEntry[2] = 0;  // Colors
  dirEntry[3] = 0;  // Reserved
  dirEntry.writeUInt16LE(1, 4);  // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel
  dirEntry.writeUInt32LE(png32Buffer.length, 8); // Size
  dirEntry.writeUInt32LE(22, 12); // Offset (6 + 16 = 22)

  return Buffer.concat([header, dirEntry, png32Buffer]);
}

const icoData = generateIco(generateIconPng(32));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoData);
fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoData);

// Generate webmanifest
const manifest = {
  name: "Osama Farouk | DevOps & Cloud Infrastructure Engineer",
  short_name: "Osama Farouk",
  description: "Certified DevOps & Cloud Infrastructure Engineer Portfolio",
  start_url: "/",
  display: "standalone",
  background_color: "#0b0f19",
  theme_color: "#0b0f19",
  icons: [
    {
      src: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    },
    {
      src: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    },
    {
      src: "/icon.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }
  ]
};

fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));

console.log('[FAVICON GENERATOR] Successfully created all favicons, apple-touch-icon, and site.webmanifest!');
