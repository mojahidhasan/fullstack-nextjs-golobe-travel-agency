import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
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

export function encryptToken(token, secret) {
  const key = Buffer.alloc(32);
  Buffer.from(secret).copy(key);

  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(token, "utf-8", "base64");
  encrypted += cipher.final("base64");

  // Concatenate IV and encrypted data without separators
  return Buffer.concat([iv, Buffer.from(encrypted, "base64")]).toString(
    "base64",
  );
}

export function decryptToken(encryptedToken, secret) {
  const key = Buffer.alloc(32);
  Buffer.from(secret).copy(key);

  const rawData = Buffer.from(encryptedToken, "base64");
  const iv = rawData.slice(0, 16); // First 16 bytes = IV
  const encrypted = rawData.slice(16); // The rest = encrypted data

  // Use createDecipheriv for decryption
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, undefined, "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
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
