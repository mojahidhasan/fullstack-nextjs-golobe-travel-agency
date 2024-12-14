import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function minutesToHMFormat(min) {
  const hours = Math.floor(min / 60);
  const remainingMinutes = min % 60;
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
