import { ImageResponse } from "next/og";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams);
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: params.color,
          color: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "100%",
        }}
      >
        {params.name[0].toLocaleUpperCase()}
      </div>
    ),
    {
      width: 128,
      height: 128,
    }
  );
}
