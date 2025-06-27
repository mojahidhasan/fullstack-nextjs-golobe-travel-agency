import validateFlightSearchParams from "../zodSchemas/flightSearchParams";
import { setCookiesAction } from "./cookiesActions";

export async function validateSearchStateAction(prevState, formData) {
  const data = Object.fromEntries(formData);
  const { success, errors, data: d } = validateFlightSearchParams(data);

  if (success === false) {
    return { success: false, errors };
  }

  try {
    const sessionTimeoutAt = new Date().getTime() + 1200 * 1000; // 20 minutes
    await setCookiesAction([
      {
        name: "flightSearchState",
        value: JSON.stringify(d),
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        name: "sessionTimeoutAt",
        value: sessionTimeoutAt,
        expires: new Date(sessionTimeoutAt),
      },
    ]);
    return {
      success: true,
      data: {
        latestSearchState: d,
        sessionTimeoutAt,
      },
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
