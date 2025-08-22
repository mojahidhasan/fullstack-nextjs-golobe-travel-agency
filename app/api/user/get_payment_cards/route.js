import { auth } from "@/lib/auth";
import { getUserDetails } from "@/lib/services/user";
import { updateOneDoc } from "@/lib/db/updateOperationDB";
import initStripe, { createCustomer } from "@/lib/paymentIntegration/stripe";
import { revalidateTag } from "next/cache";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return Response.json({ success: false, message: "Unauthenticated" });

  const user = await getUserDetails(session.user.id);
  let customerId = user?.customerId;

  if (!customerId) {
    const customer = await createCustomer({
      name: user.name,
      email: user.email,
    });
    customerId = customer.id;
    await updateOneDoc("User", { _id: user._id }, { customerId: customer.id });
    revalidateTag("userDetails");
    return Response.json({
      success: true,
      data: [],
      message: "Payment methods fetched successfully",
    });
  }
  try {
    const stripe = initStripe();
    const payment = await stripe.paymentMethods.list({ customer: customerId });
    return Response.json(
      {
        success: true,
        data: payment.data.map((item) => {
          return {
            id: item.id,
            cardType: item.card?.brand,
            last4Digits: item.card?.last4,
            validTill:
              String(item.card?.exp_month).padStart(2, "0") +
              "/" +
              String(item.card?.exp_year).substring(2),
          };
        }),
        message: "Payment methods fetched successfully",
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return Response.json(
      {
        success: false,
        message: "An error occurred, please try again",
      },
      { status: 500 },
    );
  }
}
