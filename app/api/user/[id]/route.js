import { getUserById } from "@/lib/db/getOperationDB";

export async function GET(req, { params }) {
  const getUser = await getUserById(params.id);

  const user = {
    name: getUser.name,
    image: getUser.image,
  };

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
