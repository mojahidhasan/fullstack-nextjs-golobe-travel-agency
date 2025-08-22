import { auth } from "@/lib/auth";
import { getUserDetails } from "@/lib/services/user";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import initStripe, {
  createUniqueCustomer,
} from "@/lib/paymentIntegration/stripe";
import { revalidateTag } from "next/cache";

export async function POST(req) {
  const body = await req.json();
  // req.body
  // accepts json string in body
  // required json params
  /**
   * {
   *  idempotencyKey: string
   * }
   */
  const session = await auth();
  if (!session?.user)
    return Response.json(
      { success: false, message: "Unauthenticated" },
      { status: 401 },
    );

  try {
    const user = await getUserDetails(session.user.id);
    let idempotencyKey = body?.idempotencyKey ?? Date.now().toString();
    let customerId = user?.customerId;
    const stripe = initStripe();
    if (!customerId) {
      //create customer
      const customer = await createUniqueCustomer(
        {
          name: user.firstName + " " + user.lastName,
          email: user.email,
        },
        null,
        ["email"],
      );
      customerId = customer.id;
      await updateOneDoc("User", { _id: user._id }, { customerId });
      revalidateTag("userDetails");
    }
    const setupIntents = await stripe.setupIntents.create(
      {
        payment_method_types: ["card"],
        customer: customerId,
        usage: "on_session",
      },
      { idempotencyKey },
    );

    return Response.json(
      {
        success: true,
        message: "Success",
        data: {
          clientSecret: setupIntents.client_secret,
          customerId,
          idempotencyKey,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
