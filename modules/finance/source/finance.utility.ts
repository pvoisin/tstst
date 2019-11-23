import BigNumber from "bignumber.js";
import { CurrencyCode } from "./currency";
import { MoneyAmount } from "./money-quantity";

/**
 * Tells whether the currency with which the provided amounts are expressed is
 * consistent.
 */
export function isCurrencyConsistent(amounts: MoneyAmount[]): boolean {
  let consitent: boolean;

  if (amounts.length > 0) {
    const currency = getConsistentCurrency(amounts);
    if (currency !== undefined) {
      consitent = !!currency;
    }
  }

  return consitent;
}

/**
 * Returns the currency with which the provided amounts are expressed.
 *
 * @returns `null` when currency is *NOT* consistent across the provided amounts.
 * @returns `undefined` when the provided amount list is empty or no currency is
 *  defined in the provided amounts.
 */
export function getConsistentCurrency(amounts: MoneyAmount[]): CurrencyCode {
  let currency: CurrencyCode;

  for (const amount of amounts) {
    if (currency) {
      if (amount.unit && amount.unit.currency !== undefined && amount.unit.currency !== currency) {
        currency = null;
        break;
      }
    } else {
      currency = amount.unit.currency;
    }
  }

  return currency;
}

/**
 * Rounds the provided value to the specified precision.
 *
 * Useful to avoid problems with JavaScript's natural number precision, like
 * `0.05 + 0.1` → `0.15000000000000002`.
 */
export function roundToPrecision(value: number, precision: number): number {
  return new BigNumber(value).dp(precision, BigNumber.ROUND_HALF_UP).toNumber();
}

/**
 * Applies the penny correction on the provided money amount.
 *
 * Penny correction is required in certain countries (for example, Canada) when
 * the penny coin was phased out.
 *
 * @param amount Amount on which to apply the penny correction.
 *
 * @see https://www.mint.ca/store/mint/about-the-mint/phasing-out-the-penny-6900002
 */
export function applyPennyCorrection(amount: MoneyAmount): MoneyAmount {
  let amountValue = amount.value + getPennyCorrection(amount.value);
  amountValue = roundToPrecision(amountValue, 2);

  return { value: amountValue, unit: amount.unit };
}

/**
 * Returns the penny correction to apply on the provided money amount value.
 *
 * @param amountValue Money amount value for which to return the penny count.
 * @param round Whether to round the provided amount value or not.
 *  Usually, for optimizations: `false` when the provided amount value was
 *  already rounded.
 *
 * @see https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/phasing-penny.html#rndng
 */
export function getPennyCorrection(amountValue: number, round: boolean = true): number {
  let correction: number = 0;

  const pennyCount: number = getPennyCount(amountValue, round);

  let threshold: number = 0;
  if (pennyCount > 2) {
    if (pennyCount < 8) {
      threshold = 5;
    } else {
      threshold = 10;
    }
  }

  correction = threshold - pennyCount;

  return correction;
}

/**
 * Returns the penny count of the provided money amount value.
 *
 * @param amountValue Money amount value for which to return the penny count.
 * @param round Whether to round the provided amount value or not.
 *  Usually, `false` when the provided amount value was already rounded.
 */
export function getPennyCount(amountValue: number, round: boolean = true): number {
  // ex.: 8 → 8
  // ex.: 12.3456 → 12.35
  let value: BigNumber = new BigNumber(amountValue);
  if (round) {
    value = value.dp(2, BigNumber.ROUND_HALF_UP);
  }

  // ex.: 8 → "8.00" → 0
  // ex.: 12.35 → "12.35" → 5
  return Number(value.toFixed(2, BigNumber.ROUND_FLOOR).substr(-1));
}
