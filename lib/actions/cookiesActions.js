import { cookies } from "next/headers";
import { z } from "zod";
import { isObject, isValidJSON } from "../utils";

export async function getCookiesAction(cookieNameArr = []) {
  const cookieStore = cookies().getAll();
  if (cookieNameArr.length === 0) {
    return cookieStore;
  }
  return cookieStore.filter((cookie) => cookieNameArr.includes(cookie.name));
}

export async function deleteCookiesAction(cookiesArr) {
  for (const cookie of cookiesArr) {
    cookies().delete(cookie);
  }
}
/**
 * @typedef {Object} Cookie
 * @property {string} name - Required. Name of the cookie.
 * @property {string} value - Required. Value of the cookie.
 * @property {string} [path] - Optional. Path scope of the cookie.
 * @property {string} [domain] - Optional. Domain scope of the cookie.
 * @property {boolean} [secure] - Optional. Send over HTTPS only.
 * @property {boolean} [httpOnly] - Optional. Inaccessible via JavaScript.
 * @property {'Strict' | 'Lax' | 'None'} [sameSite] - Optional. Cross-site behavior.
 * @property {Date} [expires] - Optional. Expiration date.
 * @property {number} [maxAge] - Optional. Max age in seconds.
 */

/**
 * Set cookies based on the provided cookies array.
 *
 * @function setCookiesAction
 * @param {Cookie[] | Cookie | string} cookiesArr - An array of ResponseCookie objects, a single object, or a JSON string.
 * @returns {Promise<{ success: boolean, message: string }>} An object indicating success status and message.
 * @throws {TypeError} If cookiesArr is not an array, object, or valid JSON string.
 * @throws {Error} If there is any unexpected error while setting cookies.
 *
 * @example
 * // Set a single cookie
 * const cookie = { name: 'myCookie', value: 'myValue' };
 * await setCookiesAction(cookie);
 *
 * // Set multiple cookies
 * const cookies = [{ name: 'cookie1', value: 'value1' }, { name: 'cookie2', value: 'value2' }];
 * await setCookiesAction(cookies);
 *
 * // Set cookies from a JSON string
 * const jsonCookies = '[{"name":"cookie1","value":"value1"},{"name":"cookie2","value":"value2"}]';
 * await setCookiesAction(jsonCookies);
 */
export async function setCookiesAction(cookiesArr) {
  const oneMonth = 60 * 60 * 24 * 30; // 30 days
  let normalized;
  if (typeof cookiesArr === "string") {
    if (!isValidJSON(cookiesArr)) {
      throw new TypeError("Invalid JSON string provided.");
    }
    const parsed = JSON.parse(cookiesArr);
    if (!Array.isArray(parsed) && !isObject(parsed)) {
      throw new TypeError("Parsed JSON must be an object or array of objects.");
    }
    normalized = Array.isArray(parsed) ? parsed : [parsed];
  } else if (Array.isArray(cookiesArr)) {
    normalized = cookiesArr;
  } else if (isObject(cookiesArr)) {
    normalized = [cookiesArr];
  } else {
    throw new TypeError(
      "Input must be an array, object, or valid JSON string.",
    );
  }
  const { success, data, errors } = cookieValidation(normalized);
  if (!success) {
    throw errors;
  }
  if (success) {
    try {
      for (const cookie of data) {
        cookies().set({
          name: cookie.name,
          value: cookie.value,
          domain: cookie?.domain ?? "",
          path: cookie?.path ?? "/",
          expires: new Date(cookie?.expires),
          secure: cookie?.secure ?? process.env.NODE_ENV === "production",
          sameSite: cookie?.sameSite ?? "strict",
          httpOnly: cookie?.httpOnly ?? true,
          maxAge: cookie?.maxAge && Number.isInteger(cookie?.maxAge),
          partitioned: cookie?.partitioned ?? false,
        });
      }
      return { success: true, message: "Cookies set successfully" };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
function cookieValidation(cookies) {
  const cookieValidation = z.array(
    z.object(
      {
        name: z
          .string({ message: "Cookie name is required" })
          .min(1, "Cookie name is required"),
        value: z.string().or(z.number()).default(""),
        domain: z.string().url().optional(),
        path: z.string().optional(),
        expires: z
          .union([
            z.date({ message: "Cookie expiration date is required" }),
            z
              .string()
              .datetime({ message: "Cookie expiration date is required" }),
          ])
          .optional(),
        secure: z.boolean().optional(),
        sameSite: z.enum(["lax", "strict", "none"]).optional(),
        httpOnly: z.boolean().optional(),
        maxAge: z.number().optional(),
        partitioned: z.boolean().optional(),
      },
      {
        message: "Cookie data must be an object",
      },
    ),
    {
      message: "Cookies data must be an array of objects",
    },
  );

  const { success: s, data: d, error } = cookieValidation.safeParse(cookies);
  let success = s;
  let data = d;
  let errors = {};
  error?.issues.forEach((issue) => {
    const name = issue.path.find((v) => typeof v == "string");
    errors[name] = issue.message;
  });
  if (success === true) {
    errors = undefined;
  }
  if (success === true && data.length < 1) {
    success = false;
    errors = {
      arg: "Array is empty",
    };
    data = undefined;
  }
  return { success, data, errors };
}
