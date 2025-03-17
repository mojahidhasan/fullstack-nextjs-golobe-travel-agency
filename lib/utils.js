import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
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
        array.indexOf(item) === index && array.lastIndexOf(item) === index
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
      array.indexOf(item) === index && array.lastIndexOf(item) !== index
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
    "base64"
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
