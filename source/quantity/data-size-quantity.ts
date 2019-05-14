import { IQuantity, IUnit, Quantity, registerUnitConversions, Unit, UnitScale } from "./quantity";
import * as deepFreeze from "deep-freeze";

export const DATA_SIZE: IQuantity = new Quantity("data size");

export const BIT: IUnit = new Unit(DATA_SIZE, "bit", "b");
export const BYTE: IUnit = new Unit(DATA_SIZE, "byte", "B");
export const KILOBIT: IUnit = new Unit(DATA_SIZE, "kilobit", "kb");
export const KILOBYTE: IUnit = new Unit(DATA_SIZE, "kilobyte", "kB");
export const MEGABIT: IUnit = new Unit(DATA_SIZE, "megabit", "Mb");
export const MEGABYTE: IUnit = new Unit(DATA_SIZE, "megabyte", "MB");
export const GIGABIT: IUnit = new Unit(DATA_SIZE, "gigabit", "Gb");
export const GIGABYTE: IUnit = new Unit(DATA_SIZE, "gigabyte", "GB");
export const TERABIT: IUnit = new Unit(DATA_SIZE, "terabit", "Tb");
export const TERABYTE: IUnit = new Unit(DATA_SIZE, "terabyte", "TB");

export const DATA_SIZE_UNIT_SCALE: UnitScale = {
  1: BIT,
  8: BYTE,
  [1000]: KILOBIT,
  [8 * 1000]: KILOBYTE,
  [1000 * 1000]: MEGABIT,
  [8 * 1000 * 1000]: MEGABYTE,
  [1000 * 1000 * 1000]: GIGABIT,
  [8 * 1000 * 1000 * 1000]: GIGABYTE,
  [1000 * 1000 * 1000 * 1000]: TERABIT,
  [8 * 1000 * 1000 * 1000 * 1000]: TERABYTE,
};
DATA_SIZE.unitScale = DATA_SIZE_UNIT_SCALE;
deepFreeze(DATA_SIZE_UNIT_SCALE); // 🔒

Object.freeze(DATA_SIZE); // 🔒

registerUnitConversions(DATA_SIZE_UNIT_SCALE);
