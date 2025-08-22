import { getUserDetails } from "@/lib/services/user";
export async function GET(req, { params }) {
  try {
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
  } catch (error) {
    return new Response(null, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
