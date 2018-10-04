import * as _ from "lodash";
import { default as chalk } from "chalk";
import { getTypeRepresentation, getValueRepresentation } from "./utility";

export function highlight(text: string): string {
  return chalk.inverse(text);
}

export function underline(text: string): string {
  return chalk.underline(text);
}

export function highlightValueRepresentation(value: any, includeType: boolean = false): string {
  let representation: string = highlight(getValueRepresentation(value));

  if (includeType) {
    representation += ` (${getTypeRepresentation(value)})`;
  }

  return representation;
}

export function highlightTypeRepresentation(value: any, includeType: boolean = false): string {
  return highlight(getTypeRepresentation(value));
}

export function highlightCollectionRepresentation(items: any[], includeType: boolean = false): string {
  return (
    items &&
    "[" +
      items
        .map(
          (item) => highlight(getValueRepresentation(item)) + (includeType ? ` (${getTypeRepresentation(item)})` : "")
        )
        .join(", ") +
      "]"
  );
}
