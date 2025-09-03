"use client";

import { toast } from "sonner";
import { isPromise } from "../utils";

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the API call was successful
 * @property {string} [message] - Optional message from the API
 * @property {any} [additionalData] - Any additional data
 */

/**
 * @typedef {Object} HandleApiOptions
 * @property {(data: any) => void} [onSuccess] - Callback when API succeeds
 * @property {(error: any) => void} [onError] - Callback when API fails
 * @property {string} [loadingMessage] - Message to show during loading
 * @property {string} [successMessage] - Message to show on success
 * @property {string} [errorMessage] - Message to show on error
 * @property {string} [id] - Optional ID for the toast
 */

/**
 * Handles API response and shows toasts
 * @param {Promise<ApiResponse>} apiCallPromise - The API function to call
 * @param {HandleApiOptions & import("sonner").ExternalToast} [options] - Options for handling success, error, and messages
 * @returns {Promise<ApiResponse>} The API response
 */
export async function getApiResponseWithToast(apiCallPromise, options) {
  const {
    onSuccess,
    onError,
    loadingMessage,
    successMessage,
    errorMessage,
    id,
  } = options || {};

  if (loadingMessage && isPromise(apiCallPromise)) {
    toast.loading(loadingMessage, { id: id });
  }

  try {
    const response = await apiCallPromise;
    if (response.success) {
      toast.success(
        successMessage || response.message || "Operation successful!",
        {
          ...(id && { id: id }),
        },
      );
      if (onSuccess) onSuccess(response, { id: id });
    } else if (response.success === false) {
      toast.error(errorMessage || response.message || "Something went wrong.", {
        ...(id && { id: id }),
      });
      if (onError) onError(response, { id: id });
    }

    return response;
  } catch (err) {
    toast.error(errorMessage || "Network error. Please try again.", {
      ...(id && { id: id }),
    });
    if (onError) onError(err, { id: id });
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
