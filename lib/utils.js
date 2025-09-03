import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultFlightFormValue } from "../reduxStore/features/flightFormSlice";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

export function normalize(num, min, max) {
  // number between 0 and 1
  return (num - min) / (max - min);
}

export function minutesToHMFormat(min) {
  const hours = Math.floor(min / 60);
  const remainingMinutes = Math.round(min % 60);
  return `${hours}h ${remainingMinutes}m`;
}

export function substractTimeInMins(a, b) {
  const timeA = new Date(a);
  const timeB = new Date(b);
  return Math.abs((timeA - timeB) / (1000 * 60));
}

export async function validateURL(str) {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url?.protocol === "http:" || url?.protocol === "https:";
}
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function debounceAsync(func, delay = 300) {
  let timeoutId;
  let lastPromiseResolve;
  let lastPromiseReject;

  return function (...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      lastPromiseResolve = resolve;
      lastPromiseReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await func.apply(this, args);
          if (lastPromiseResolve === resolve) {
            // Ensure only the latest call resolves
            resolve(result);
          }
        } catch (error) {
          if (lastPromiseReject === reject) {
            // Ensure only the latest call rejects
            reject(error);
          }
        }
      }, delay);
    });
  };
}

export function isPromise(value) {
  return (
    !!value && // Check that the value is not null or undefined
    (typeof value === "object" || typeof value === "function") && // Check if it's an object or function
    typeof value.then === "function" // Check if it has a .then method
  );
}

export function isEmailValid(email) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function findOnlyUniqueElements(arr, ...moreArrs) {
  //arr is required param
  if (!arr) {
    throw new Error("first argument is required");
  }

  // check if all args are arrays
  if (!Array.isArray(arr)) {
    throw new Error("ensure all arguments are arrays");
  }
  if (moreArrs.length > 0) {
    for (const arr of moreArrs) {
      if (!Array.isArray(arr)) {
        throw new Error("ensure all arguments are arrays");
      }
    }
  }

  return arr
    .concat(...moreArrs)
    .filter(
      (item, index, array) =>
        array.indexOf(item) === index && array.lastIndexOf(item) === index,
    );
}

export function findOnlyDuplicateElements(arr, ...moreArrs) {
  if (!arr) {
    throw new Error("first argument is required");
  }

  // check if all args are arrays
  if (!Array.isArray(arr)) {
    throw new Error("ensure all arguments are arrays");
  }
  if (moreArrs.length > 0) {
    for (const arr of moreArrs) {
      if (!Array.isArray(arr)) {
        throw new Error("ensure all arguments are arrays");
      }
    }
  }

  return arr.filter(
    (item, index, array) =>
      array.indexOf(item) === index && array.lastIndexOf(item) !== index,
  );
}

// https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
export function objDeepCompare() {
  var i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (
      isNaN(x) &&
      isNaN(y) &&
      typeof x === "number" &&
      typeof y === "number"
    ) {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if (
      (typeof x === "function" && typeof y === "function") ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)
    ) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof x[p]) {
        case "object":
        case "function":
          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    // return true; //Die silently? Don't know how to handle such case, please help...
    throw new Error("Need two or more arguments to compare");
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
}

export function passengerStrToObject(passengersStr) {
  const extractPassengers = {};
  passengersStr.split("_").forEach((el) => {
    const [key, val] = el.split("-");
    extractPassengers[key] = +val;
  });
  return extractPassengers;
}

export function passengerObjectToStr(passengerObj) {
  if (!isObject(passengerObj)) return "";
  const p = passengerObj;
  return `adults-${p?.adults}_children-${p?.children}_infants-${p?.infants}`;
}

export function airportStrToObject(airportStr) {
  const extractAirport = {};
  const arr = airportStr.split("_");
  extractAirport.iataCode = arr[0];
  extractAirport.name = arr[1];
  extractAirport.city = arr[2];
  return extractAirport;
}

export function parseFlightSearchParams(searchParamsJSON) {
  const isValidArg =
    isObject(searchParamsJSON) || typeof searchParamsJSON === "string";
  if (!isValidArg) {
    throw new Error("Invalid argument. Expected object or JSON string");
  }

  let parsedSearchState = {};
  if (typeof searchParamsJSON === "string") {
    parsedSearchState = { ...JSON.parse(searchParamsJSON) };
  } else {
    parsedSearchState = { ...searchParamsJSON };
  }

  parsedSearchState.passengers = parsedSearchState?.passengers
    ? passengerStrToObject(parsedSearchState.passengers)
    : defaultFlightFormValue.passengers;

  parsedSearchState.from = parsedSearchState?.from
    ? airportStrToObject(parsedSearchState.from)
    : {};
  parsedSearchState.to = parsedSearchState?.to
    ? airportStrToObject(parsedSearchState.to)
    : {};
  return parsedSearchState;
}

export function airportObjectToStr(airportObj) {
  if (!isObject(airportObj)) {
    return "";
  }
  const ap = airportObj;
  return `${ap?.iataCode}_${ap?.name}_${ap?.city}`;
}

export function isDateObjValid(date) {
  if (date === null) return false;
  return new Date(date).toString() !== "Invalid Date";
}

export function isObject(x) {
  return typeof x === "object" && !Array.isArray(x) && x !== null;
}

export function strtoBase64(str) {
  return Buffer.from(str).toString("base64");
}

export function base64toStr(base64) {
  return Buffer.from(base64, "base64").toString("utf-8");
}

export function base64ToArrayBuffer(base64) {
  const binaryString = Buffer.from(base64, "base64").toString("binary");
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function base64toBlob(base64Image) {
  const parts = base64Image.split(";base64,");
  if (parts.length !== 2) {
    throw new Error("Invalid base64 image format.");
  }

  const contentType = parts[0].split(":")[1];
  const b64Data = parts[1];

  const byteArray = base64ToArrayBuffer(b64Data);
  const blob = new Blob([byteArray], { type: contentType });
  return blob;
}

export function blobToUrl(blob) {
  return URL.createObjectURL(blob);
}

export function nanoid() {
  return customAlphabet("1234567890abcdefhijklmnopqrstuvwxyz", 6)();
}
export function customAlphabet(alphabet, length) {
  return () => {
    let id = "";
    for (let i = 0; i < length; i++) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return id;
  };
}

export function isValidJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

export function usdToCents(usd) {
  return +usd * 100;
}

export function centsToUSD(cents) {
  return +cents / 100;
}

export function groupBy(items, callbackFn) {
  if (items == null) {
    throw new TypeError("Object.groupBy called on null or undefined");
  }

  if (typeof callbackFn !== "function") {
    throw new TypeError("callbackFn must be a function");
  }

  const result = Object.create({});
  let index = 0;

  for (const element of items) {
    const key = callbackFn(element, index++);
    const groupKey = typeof key === "symbol" ? key : String(key);

    if (!Object.prototype.hasOwnProperty.call(result, groupKey)) {
      result[groupKey] = [];
    }

    result[groupKey].push(element);
  }

  return result;
}
export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(+amount);
}

export function deepSanitize(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  const result = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    if (!["__proto__", "constructor", "prototype"].includes(key)) {
      result[key] = deepSanitize(obj[key]);
    }
  }
  return result;
}

export function formatDateToYYYYMMDD(date, timeZone = "UTC") {
  return date.toLocaleString("en-CA", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Rounds a number to its nearest power of 10, floored to 1 significant figure.
 *
 * @param {number} n - The number to round.
 * @throws {Error} If the input is not a number or not finite.
 * @return {number} The rounded number.
 */
export function roundToBucketBase(n) {
  if (isNaN(n)) throw new Error("Input must be a number.");
  if (!Number.isFinite(+n)) throw new Error("Input must be a finite number.");
  if (n === 0) return 0;

  const sign = Math.sign(+n);
  const x = Math.abs(+n);

  // 10^(floor(log10(x))) -> largest power of 10 <= x
  const pow10 = Math.pow(10, Math.floor(Math.log10(x)));
  const leading = Math.floor(x / pow10);

  return sign * leading * pow10; // floored to 1 significant figure
}

/**
 * Bucketizes a number by rounding it to its nearest power of 10, with a single significant figure.
 * Appends a compact suffix (k, M, B, T, P, E) to indicate the order of magnitude of the number.
 *
 * @param {number} n - The number to bucketize. Must be a finite number.
 * @throws {Error} If `n` is not a finite number.
 * @return {string} The bucketized number as a string, with a compact suffix.
 */
export function bucketizeNumber(n) {
  if (isNaN(n)) throw new Error("Input must be a number.");
  if (!Number.isFinite(+n)) throw new Error("Input must be a finite number.");

  const floored = roundToBucketBase(n);
  const sign = floored < 0 ? "-" : "";
  let x = Math.abs(floored);

  // Compact suffixes (thousands and up)
  const units = ["", "k", "M", "B", "T", "P", "E"];
  let u = 0;

  while (x >= 1000 && u < units.length - 1) {
    if (x % 1000 !== 0) break; // keep integers only; but with 1-sig-fig, this holds naturally
    x = x / 1000;
    u++;
  }

  return sign + String(x) + units[u];
}
