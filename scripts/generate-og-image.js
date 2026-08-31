const fs = require('fs');
const path = require('path');

// Preserves the official custom 1200x630 social preview image (public/og-image.png)
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');

if (fs.existsSync(outputPath)) {
  console.log(`[OG IMAGE GENERATOR] Verified custom production social preview image at ${outputPath}`);
} else {
  console.warn(`[OG IMAGE GENERATOR] Warning: ${outputPath} does not exist.`);
}
