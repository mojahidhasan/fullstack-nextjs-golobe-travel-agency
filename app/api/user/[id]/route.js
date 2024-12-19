import { getOneDoc } from "@/lib/db/getOperationDB";
export async function GET(req, { params }) {
  const getUser = await getOneDoc("User", { _id: params.id }, ["userDetails"]);
  const user = {
    name: Object.keys(getUser).length ? getUser?.firstname + " " + getUser?.lastname : "A golobe user",
    profileImage: getUser?.profileImage ?? null,
  };

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
