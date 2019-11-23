import { getCartesianProduct } from "@tstst/general";
import BigNumber from "bignumber.js";

export interface Quantity {
  name: string;
  unitScale: UnitScale<this>;
}

export class DefaultQuantity implements Quantity {
  name: string;
  unitScale: UnitScale<this>;

  constructor(name: string, unitScale: UnitScale = {}) {
    this.name = name;
    this.unitScale = unitScale as UnitScale<this>;
  }

  toString(): string {
    return this.name;
  }
}

export interface Unit<Q extends Quantity = Quantity> {
  name: string;
  quantity: Q;
  symbol: string;
}

export class DefaultUnit<Q extends Quantity = Quantity> implements Unit<Q> {
  name: string;
  quantity: Q;
  symbol: string;

  constructor(quantity: Q, name: string, symbol: string) {
    this.quantity = quantity;
    this.name = name;
    this.symbol = symbol;
  }

  toString(): string {
    return this.symbol;
  }
}

export interface UnitScale<Q extends Quantity = Quantity> {
  [factor: string]: Unit<Q>;
}

export interface Amount<Q extends Quantity = Quantity, U extends Unit<Q> = Unit<Q>> {
  value: number;
  unit: U;
}

export function getUnitForSymbol<Q extends Quantity>(symbol: string, quantity: Q): Unit<Q> {
  let result: Unit<Q> = null;

  for (const unit of (Object as any).values(quantity.unitScale)) {
    if (unit.symbol === symbol) {
      result = unit;
      break;
    }
  }

  return result;
}

const UNIT_CONVERSIONS: Map<Unit, Map<Unit, (amount: Amount) => number>> = new Map();

export function registerUnitConversion(
  unit1: Unit,
  unit2: Unit,
  conversion: (amount: number) => number
): (amount: Amount) => number {
  if (unit1.quantity !== unit2.quantity) {
    throw new Error(`Incompatible quantities! ${unit1.quantity} ⇄ ${unit2.quantity}`);
  }

  let conversions: Map<Unit, (value: Amount) => number> = UNIT_CONVERSIONS.get(unit1);
  if (!conversions) {
    conversions = new Map();
    UNIT_CONVERSIONS.set(unit1, conversions);
  }

  const wrapper = (amount: Amount) => {
    return conversion(amount.value);
  };

  conversions.set(unit2, wrapper);

  return wrapper;
}

export function registerUnitConversions<Q extends Quantity>(unitScale: UnitScale<Q>) {
  const referenceUnit = unitScale[1];

  if (!referenceUnit) {
    throw new Error("Missing reference unit!");
  }

  const factors = Object.keys(unitScale);
  for (const combination of getCartesianProduct(factors, factors)) {
    let factor1 = combination[0];
    let factor2 = combination[1];
    const unit1 = unitScale[factor1];
    const unit2 = unitScale[factor2];
    factor1 = new BigNumber(factor1);
    factor2 = new BigNumber(factor2);

    registerUnitConversion(unit1, unit2, (amount) => {
      return new BigNumber(amount)
        .multipliedBy(factor1)
        .dividedBy(factor2)
        .toNumber();
    });
  }
}

export function convertAmount<Q extends Quantity, U extends Unit<Q>>(amount: Amount<Q>, unit: U): number {
  return UNIT_CONVERSIONS.get(amount.unit).get(unit)(amount);
}
