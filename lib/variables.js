import "server-only";

import { cookies } from "next/headers";
import { auth } from "./auth";

let timezone = cookies().get("timezone")?.value || "UTC";
let flightClass = cookies().get("fc")?.value || null;
let session = await auth();

export { timezone, flightClass, session };
