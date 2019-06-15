import * as deepFreeze from "deep-freeze";
import { Amount, DefaultQuantity, DefaultUnit, Quantity, registerUnitConversions, Unit, UnitScale } from ".";

export interface DataSizeQuantity extends Quantity {}

export const DATA_SIZE: DataSizeQuantity = new DefaultQuantity("data size");

export interface DataSizeUnit extends Unit<DataSizeQuantity> {}

export interface DataSizeAmount extends Amount<DataSizeQuantity, DataSizeUnit> {}

export function isDataSizeAmount(amount: Amount): amount is DataSizeAmount {
  return amount && amount.unit && amount.unit.quantity === DATA_SIZE;
}

export class DefaultDataSizeUnit extends DefaultUnit implements DataSizeUnit {
  name: string;

  constructor(name: string, symbol: string) {
    super(DATA_SIZE, name, symbol);
  }
}

export const BIT: DataSizeUnit = new DefaultDataSizeUnit("bit", "b");
export const BYTE: DataSizeUnit = new DefaultDataSizeUnit("byte", "B");
export const KILOBIT: DataSizeUnit = new DefaultDataSizeUnit("kilobit", "kb");
export const KILOBYTE: DataSizeUnit = new DefaultDataSizeUnit("kilobyte", "kB");
export const MEGABIT: DataSizeUnit = new DefaultDataSizeUnit("megabit", "Mb");
export const MEGABYTE: DataSizeUnit = new DefaultDataSizeUnit("megabyte", "MB");
export const GIGABIT: DataSizeUnit = new DefaultDataSizeUnit("gigabit", "Gb");
export const GIGABYTE: DataSizeUnit = new DefaultDataSizeUnit("gigabyte", "GB");
export const TERABIT: DataSizeUnit = new DefaultDataSizeUnit("terabit", "Tb");
export const TERABYTE: DataSizeUnit = new DefaultDataSizeUnit("terabyte", "TB");

export const DATA_SIZE_UNIT_SCALE: UnitScale<DataSizeQuantity> = {
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
