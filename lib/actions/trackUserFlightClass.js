import { cookies } from "next/headers";

export default async function trackUserFlightClass(prevState, formData) {
  const flightClass =
    formData instanceof FormData
      ? formData.get("flightClass")
      : formData.flightClass;

  cookies().set("fc", flightClass, {
    path: "/flights",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    maxAge: 99999999999999,
  }); // flightClass
  return { success: true, message: "Flight class tracked successfully" };
}
