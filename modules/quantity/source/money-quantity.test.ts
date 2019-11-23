import { CAD, USD } from ".";
import { EUR } from "./money-quantity";
import { testConvertAmount } from "./quantity.test.helper";

testConvertAmount([
  [{ value: 10, unit: CAD }, USD, "7.4"],
  [{ value: 1, unit: USD }, CAD, "1.35"],
  [{ value: 33, unit: CAD }, EUR, "21.8"],
  [{ value: 1, unit: EUR }, CAD, "1.51"],
]);
