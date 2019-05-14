import { Amount, convertAmount, getUnitForSymbol, IUnit } from "./quantity";
import { extract } from "../string.utility";

export const AMOUNT_COMPONENT_PATTERN = /\s*((?:\+|-)?\d+(?:\.\d+)?)(°?[a-zA-Z²³]{1,3}(?:\/[a-zA-Z²³]{1,3})?)/;
Object.freeze(AMOUNT_COMPONENT_PATTERN);
//const AMOUNT_PATTERN = new RegExp(`(?:${AMOUNT_COMPONENT_PATTERN.source})+$`);

export class AmountParser {
  public parse(representation: string, unit: IUnit): Amount {
    let result: Amount = null;

    const components = extract(representation, AMOUNT_COMPONENT_PATTERN, true);
    if (components) {
      result = { value: 0, unit };
      const quantity = unit.quantity;

      for (const component of components) {
        const componentSymbol = component[1];
        const componentUnit = getUnitForSymbol(componentSymbol, quantity);

        if (!componentUnit) {
          result = null;
          break;
        }

        const componentAmount = { value: +component[0], unit: componentUnit };
        result.value += convertAmount(componentAmount, unit);
      }
    }

    return result;
  }
}

export const parser = new AmountParser();

export const parseAmount: (representation: string, unit: IUnit) => Amount = parser.parse.bind(parser);
