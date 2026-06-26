import { ActionResult } from "@/types/action-result";

export function success<T = unknown>(
  message: string,
  data?: T
): ActionResult<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function failure(
  message: string
): ActionResult {
  return {
    success: false,
    message,
  };
}