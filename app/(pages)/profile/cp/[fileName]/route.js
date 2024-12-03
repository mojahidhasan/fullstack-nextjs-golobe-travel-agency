import { getBucketPhotoUrl } from "@/lib/storage";
import { ImageResponse } from "next/og";
export async function GET(req, { params }) {
  const { fileName } = params;
  const url = await getBucketPhotoUrl(fileName, "cp");

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img width={1296} height={350} src={url} alt={"coverPhoto"} />
    ),
    {
      width: 1296,
      height: 350,
    }
  );
}
