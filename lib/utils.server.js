import "server-only";
import { generate } from "text-to-image";
import { createHmac } from "node:crypto";
export async function generateAvatar(firstname) {
  const firstLetter = firstname.charAt(0).toUpperCase();

  //blackish random hex rgb color generate
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);

  const color = `rgb(${r},${g},${b})`;

  try {
    const dataUri = await generate(firstLetter, {
      customHeight: 128,
      maxWidth: 128,
      bgColor: color,
      textColor: "white",
      textAlign: "center",
      verticalAlign: "center",
      fontSize: 60,
      fontFamily: "Arial",
      lineHeight: 128,
    });

    return dataUri;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export function generateHMACSignature(data, secret) {
  return createHmac("sha256", secret).update(data).digest("base64");
}
