import * as deepFreeze from "deep-freeze";
import { getTypeRepresentation } from "./type";

export const freeze = deepFreeze;

export function getValueRepresentation<T = unknown>(value: T, includeTypeRepresentation: boolean = false): string {
  let representation: string;

  try {
    representation = JSON.stringify(value);
  } catch {
    representation = String(value);
  }

  if (includeTypeRepresentation) {
    representation += ` (${getTypeRepresentation(value)})`;
  }

  return representation;
}
