import { freeze } from "@tstst/general";
import {
  Amount,
  DefaultQuantity,
  DefaultUnit,
  Quantity,
  registerUnitConversions,
  Unit,
  UnitScale,
} from "@tstst/quantity";
import { CurrencyCode, getCurrencyCodeId } from "./currency";

export interface MoneyQuantity extends Quantity {}

export const MONEY: MoneyQuantity = new DefaultQuantity("money");

export interface MoneyUnit extends Unit<MoneyQuantity> {
  currency: CurrencyCode;
}

export interface MoneyAmount extends Amount<MoneyQuantity, MoneyUnit> {}

export function isMoneyAmount(amount: Amount): amount is MoneyAmount {
  return amount && amount.unit && amount.unit.quantity === MONEY;
}

export class DefaultMoneyUnit extends DefaultUnit implements MoneyUnit {
  currency: CurrencyCode;
  name: string;

  constructor(name: string, currency: CurrencyCode, symbol: string = getCurrencyCodeId(currency)) {
    super(MONEY, name, symbol);

    this.currency = currency;
  }
}

export const CANADIAN_DOLLAR: MoneyUnit = new DefaultMoneyUnit("Canadian dollar", CurrencyCode.CAD);
freeze(CANADIAN_DOLLAR);
export const CAD: MoneyUnit = CANADIAN_DOLLAR;

export const AMERICAN_DOLLAR: MoneyUnit = new DefaultMoneyUnit("American dollar", CurrencyCode.USD);
freeze(AMERICAN_DOLLAR);
export const USD: MoneyUnit = AMERICAN_DOLLAR;

export const EURO: MoneyUnit = new DefaultMoneyUnit("Euro", CurrencyCode.EUR);
freeze(EURO);
export const EUR: MoneyUnit = EURO;

export const MONEY_UNIT_SCALE: UnitScale<MoneyQuantity> = {
  0.74: CAD,
  1: USD,
  1.12: EUR,
};

MONEY.unitScale = MONEY_UNIT_SCALE;
freeze(MONEY_UNIT_SCALE); // 🔒
Object.freeze(MONEY); // 🔒

registerUnitConversions(MONEY_UNIT_SCALE);
