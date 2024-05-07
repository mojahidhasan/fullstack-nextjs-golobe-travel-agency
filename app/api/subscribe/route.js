export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request) {
  return Response.json({ url: request.url });
}
