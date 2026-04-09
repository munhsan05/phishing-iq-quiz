"use client";

import { USER_ID_STORAGE_KEY } from "./constants";

/**
 * Get the current user's UUID from localStorage, generating a new one
 * (via `crypto.randomUUID()`) if none exists.
 *
 * Must only be called on the client — throws if `window` is undefined.
 * Import inside client components only (this module is marked `"use client"`).
 */
export function getOrCreateUserId(): string {
  if (typeof window === "undefined") {
    throw new Error(
      "getOrCreateUserId must be called from a client component",
    );
  }
  let id = window.localStorage.getItem(USER_ID_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(USER_ID_STORAGE_KEY, id);
  }
  return id;
}

/** Return the stored user ID without generating one. Null if absent. */
export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_ID_STORAGE_KEY);
}

/** Clear the stored user ID (useful for testing or "sign out"). */
export function clearUserId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_ID_STORAGE_KEY);
}
