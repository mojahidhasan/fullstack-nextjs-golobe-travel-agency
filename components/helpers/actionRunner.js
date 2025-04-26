"use client";
import { useEffect, useRef } from "react";
import { objDeepCompare } from "@/lib/utils";
export default function ActionRunner({ actions = [] }) {
  const prevDeps = useRef([]);

  useEffect(() => {
    // Initialize previous dependencies
    if (prevDeps.current.length === 0) {
      prevDeps.current = actions.map((action) =>
        Array.isArray(action)
          ? action.slice(1).map(normalizeForComparison)
          : null,
      );

      // First run - execute all actions
      actions.forEach((action) => {
        const fn = Array.isArray(action) ? action[0] : action;
        const args = Array.isArray(action)
          ? prepareArgsForExecution(action.slice(1))
          : [];
        fn(...args);
      });
      return;
    }

    // Subsequent runs
    actions.forEach((action, index) => {
      if (!Array.isArray(action)) return;

      const [fn, ...currentRawDeps] = action;
      const currentDeps = currentRawDeps.map(normalizeForComparison);
      const previousDeps = prevDeps.current[index];

      // Check if dependencies changed
      if (
        !previousDeps ||
        currentDeps.length !== previousDeps.length ||
        !arrayDeepCompare(currentDeps, previousDeps)
      ) {
        const args = prepareArgsForExecution(currentRawDeps);
        fn(...args);
        prevDeps.current[index] = currentDeps;
      }
    });
  }, [actions]);

  return null;
}

// Normalize values for comparison (no serialization of FormData)
function normalizeForComparison(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object" && value !== null) {
    // Handle FormData that's already been converted to array of entries
    if (
      Array.isArray(value) &&
      value.every((item) => Array.isArray(item) && item.length === 2)
    ) {
      return value;
    }
    return JSON.parse(JSON.stringify(value));
  }
  return value;
}

// Prepare arguments for execution (reconstruct FormData when needed)
function prepareArgsForExecution(args) {
  return args.map((arg) => {
    // Check if it's a FormData entries array
    if (
      Array.isArray(arg) &&
      arg.every((item) => Array.isArray(item) && item.length === 2)
    ) {
      const formData = new FormData();
      arg.forEach(([key, value]) => formData.append(key, value));
      return formData;
    }
    return arg;
  });
}

function arrayDeepCompare(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val, i) => objDeepCompare(val, b[i]));
}
