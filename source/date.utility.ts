import * as _ from "lodash";
import * as moment from "moment";
import { getValueRepresentation } from "./utility";
import { Moment } from "moment";

export function isDateEqual(value: DateDefinition, expectedDate: DateDefinition) {
  const _moment: Moment = moment(value);
  const expectedMoment = moment(expectedDate);

  return _moment.isSame(expectedMoment);
}

/** @see https://momentjs.com/docs/#/query/is-between/ */
export function isDateBetween(
  value: DateDefinition,
  expectedDate: DateRangeDefinition,
  inclusivity: "()" | "[)" | "(]" | "[]" = "[]"
) {
  const _moment: Moment = moment(value);

  return _moment.isBetween(expectedDate[0], moment(expectedDate[1]), null, inclusivity);
}

export type DateDefinition = string | Date | Moment;
export type DateRangeDefinition = [DateDefinition, DateDefinition];
export type CompatibleDateDefinition = DateDefinition | DateRangeDefinition;

export function isDate(value: any): boolean {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isDateRange(value: any[]): boolean {
  let result: boolean = !!value && value.length === 2;

  if (result) {
    let dateItemCount: number = 0;
    let otherItemCount: number = 0;

    for (const item of value) {
      if (isDate(item)) {
        dateItemCount++;
      } else if (item !== undefined && item !== null) {
        otherItemCount++;
      }
    }

    result = dateItemCount > 0 && otherItemCount < 1;
  }

  return result;
}

/**
 * Returns a "safe" date from the given definition.
 *
 * `String` are not considered "safe" as they can contain anything, including invalid dates.
 * `Moment` values are not considered "safe" since `Moment` tolerates exceptions and advanced features that `Date` doesn't support.
 */
export function getSafeDate(dateDefinition: DateDefinition): Date {
  let result: Date;

  if (dateDefinition !== undefined && dateDefinition !== null) {
    const deprecationWarningsEnabled = (moment as any).suppressDeprecationWarnings;
    (moment as any).suppressDeprecationWarnings = true;
    try {
      result = moment(dateDefinition).toDate();
    } finally {
      (moment as any).suppressDeprecationWarnings = deprecationWarningsEnabled;
    }
  }

  if (!result || !isDate(result)) {
    const valueRepresentation = getValueRepresentation(dateDefinition);
    throw new Error(`Unsupported date definition! ${valueRepresentation}`);
  }

  return result;
}

/**
 * Returns a "safe" date range from the given definition.
 *
 * @see `#getSafeDate`
 */
export function getSafeDateRange(dateRangeDefinition: DateRangeDefinition): [Date, Date] {
  return [getSafeDate(dateRangeDefinition[0]), getSafeDate(dateRangeDefinition[1])];
}

export function isDateCompatible(value: DateDefinition, expectedDate: CompatibleDateDefinition) {
  let compatible = false;

  if (expectedDate instanceof Array) {
    compatible = isDateBetween(value, expectedDate);
  } else {
    compatible = isDateEqual(value, expectedDate);
  }

  return compatible;
}

export type TimeUnitSymbol = "ms" | "s" | "m" | "h" | "d" | "w";

export function getDateRangeAround(
  value: DateDefinition,
  marginValue: number,
  marginUnit: TimeUnitSymbol
): DateRangeDefinition {
  const _moment = moment(value);
  return [_moment.subtract(marginValue, marginUnit), _moment.add(marginValue, marginUnit)];
}

export const ISO_DATE_PATTERN: RegExp = /^(\d{4}(-?)(?:0\d|1[0-2])\2?(?:[0-2]\d|3[0-1]))(?:[T ]([0-2][0-3](:?)[0-5]\d\4[0-5]\d)(?:[.,](\d{3}))?([+-](?:[01]\d(?::?[0-5]\d)?)|Z)?)?$/;
