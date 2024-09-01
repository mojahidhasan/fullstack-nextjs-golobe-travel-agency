import { ImageResponse } from "next/og";

async function generateAvatar(firstname) {
  const firstLetter = firstname.charAt(0).toUpperCase();

  //blackish random hex rgb color generate

  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);

  const color = `rgb(${r},${g},${b})`;

  const imgRes = new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
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
    }
  );

  try {
    const blob = await imgRes.blob();
    const buffer = await blob.arrayBuffer();

    return `data:${blob.type};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch (error) {
    throw new Error("Failed to generate avatar image");
  }
}

export { generateAvatar };
