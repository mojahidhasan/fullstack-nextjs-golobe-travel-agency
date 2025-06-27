import "server-only";
import { createHmac } from "node:crypto";
import sharp from "sharp";
import { ImageResponse } from "next/og";
export async function generateAvatar(firstname) {
  const firstLetter = firstname.charAt(0).toUpperCase();

  //blackish random hex rgb color generate
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);

  const color = `rgb(${r},${g},${b})`;
  if (process.env.NODE_ENV === "production") {
    const imgRes = new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            fontFamily: "Arial, sans-serif",
            background: color,
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {firstLetter}
        </div>
      ),
      {
        width: 128,
        height: 128,
      },
    );

    try {
      const blob = await imgRes.blob();
      const buffer = await blob.arrayBuffer();

      return `data:${blob.type};base64,${Buffer.from(buffer).toString("base64")}`;
    } catch (error) {
      throw new Error("Failed to generate avatar image");
    }
  } else {
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
}
export function generateHMACSignature(data, secret) {
  return createHmac("sha256", secret).update(data).digest("base64");
}
