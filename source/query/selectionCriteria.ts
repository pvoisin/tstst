import { Mapping } from "..";

/**
 * Structure holding sort criteria, orderly.
 * It helps preparing SQL "order by" clauses.
 */
export type SelectionCriteria<T = any> = FieldSelection<T>;

export type FieldSelection<T> = Mapping<T, boolean>;

/**
 * Tells whether the specifed field is marked as "selected" in the given selection.
 *
 * @param otherFieldKeys Keys of other fields to consider if the first field isn't
 * marked as "selected". It helps writing certain conditions more easily where
 * some fields are equivalent.
 */
export function isFieldSelected<T>(fieldSelection: FieldSelection<T>, fieldKey: string, ...otherFieldKeys: string[]) {
  let selected: boolean = false;

  if (fieldSelection) {
    // tslint:disable-next-line:no-boolean-literal-compare
    selected = fieldSelection[fieldKey] === true;
    if (!selected) {
      for (const otherFieldKey of otherFieldKeys) {
        if (fieldSelection[otherFieldKey]) {
          selected = true;
          break;
        }
      }
    }
  }

  return selected;
}

/** Returns the keys of the fields that are marked as "selected" in the given criteria. */
export function getSelectedFieldKeys<T>(fieldSelection: FieldSelection<T>): string[] {
  let selectedFieldKeys: string[];

  if (fieldSelection) {
    selectedFieldKeys = [];

    for (const fieldKey in fieldSelection) {
      if (fieldSelection[fieldKey]) {
        selectedFieldKeys.push(fieldKey);
      }
    }
  }

  return selectedFieldKeys;
}
