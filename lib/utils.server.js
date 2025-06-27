import "server-only";
import { createHmac } from "node:crypto";
import sharp from "sharp";
export async function generateAvatar(firstname) {
  const firstLetter = firstname.charAt(0).toUpperCase();

  //blackish random hex rgb color generate
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);

  const color = `rgb(${r},${g},${b})`;
  const size = 128;
  const fontSize = 64;
  const textColor = "white";
  try {
    const svg = `
    <svg width="${size}" height="${size}">
      <rect width="100%" height="100%" fill="${color}" />
      <text x="50%" y="50%" dy=".35em"
            text-anchor="middle"
            font-family="Arial"
            font-weight="bold"
            font-size="${fontSize}"
            fill="${textColor}">
        ${firstLetter}
      </text>
    </svg>
  `;

    const pngBuffer = await sharp(Buffer.from(svg)).jpeg().toBuffer();
    const imageData = "data:image/jpg;base64," + pngBuffer.toString("base64");

    return imageData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export function generateHMACSignature(data, secret) {
  return createHmac("sha256", secret).update(data).digest("base64");
}
