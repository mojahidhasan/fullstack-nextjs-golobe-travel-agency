import { getUserDetails } from "@/lib/controllers/user";
export async function GET(req, { params }) {
  const getUser = await getUserDetails(params.id);
  const user = {
    name: Object.keys(getUser).length
      ? getUser?.firstName + " " + getUser?.lastName
      : "A golobe user",
    profileImage: getUser?.profileImage ?? null,
  };

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
