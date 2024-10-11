import { getUserById } from "@/lib/db/getOperationDB";
export async function GET(req, { params }) {
  const getUser = await getUserById(params.id);

  const user = {
    name: getUser?.name ?? "A golob user",
    image: getUser?.image ?? null,
  };

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
