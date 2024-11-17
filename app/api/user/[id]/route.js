import { getOneDoc } from "@/lib/db/getOperationDB";
export async function GET(req, { params }) {
  const getUser = await getOneDoc("User", { _id: params.id });
  const user = {
    name: getUser?.firstname + " " + getUser?.lastname ?? "A golob user",
    profileImage: getUser?.profileImage ?? null,
  };

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
