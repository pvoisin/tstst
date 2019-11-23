import * as deepFreeze from "deep-freeze";
import { Amount, DefaultQuantity, DefaultUnit, Quantity, registerUnitConversions, Unit, UnitScale } from ".";

export interface TimeQuantity extends Quantity {}

export const TIME: TimeQuantity = new DefaultQuantity("time");

export interface TimeUnit extends Unit<TimeQuantity> {}

export interface TimeAmount extends Amount<TimeQuantity, TimeUnit> {}

export function isTimeAmount(amount: Amount): amount is TimeAmount {
  return amount && amount.unit && amount.unit.quantity === TIME;
}

export class DefaultTimeUnit extends DefaultUnit implements TimeUnit {
  name: string;

  constructor(name: string, symbol: string) {
    super(TIME, name, symbol);
  }
}

export const NANOSECOND: TimeUnit = new DefaultTimeUnit("nanosecond", "ns");
export const MICROSECOND: TimeUnit = new DefaultTimeUnit("microsecond", "µs");
export const MILLISECOND: TimeUnit = new DefaultTimeUnit("mllisecond", "ms");
export const SECOND: TimeUnit = new DefaultTimeUnit("second", "s");
export const MINUTE: TimeUnit = new DefaultTimeUnit("minute", "m");
export const HOUR: TimeUnit = new DefaultTimeUnit("hour", "h");
export const DAY: TimeUnit = new DefaultTimeUnit("day", "d");
export const WEEK: TimeUnit = new DefaultTimeUnit("week", "w");

export const TIME_UNIT_SCALE: UnitScale<TimeQuantity> = {
  "0.000000001": NANOSECOND,
  "0.000001": MICROSECOND,
  "0.001": MILLISECOND,
  1: SECOND,
  60: MINUTE,
  [60 * 60]: HOUR,
  [24 * 60 * 60]: DAY,
  [7 * 24 * 60 * 60]: WEEK,
};

TIME.unitScale = TIME_UNIT_SCALE;
deepFreeze(TIME_UNIT_SCALE); // 🔒
Object.freeze(TIME); // 🔒

registerUnitConversions(TIME_UNIT_SCALE);
