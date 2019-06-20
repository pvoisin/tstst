import { assert } from "chai";
import { getCondition } from ".";
import { Visitor } from "../utility";
import { Condition } from "./condition";
import { DefaultConditionProcessor } from "./processor";

describe("Logic Helper", () => {
  describe("#getCondition", () => {
    it("with valid condition", () => {
      const date = new Date();
      const condition = getCondition({
        "&&": [
          {
            "ANIMAL.breed": "*shepard",
            "OWNER.id": 34087346,
            "!": {
              "PERMIT.acknowledged": null,
            },
            // prettier-ignore
            "|": [
              { expiryDate: null },
              { expiryDate: [null, date] }
            ]
          },
        ],
      });

      const processor = new TrivialConditionProcessor();
      let output: string = "";
      const accumulator: Visitor<string> = (fragment) => (output += fragment);
      processor.processCondition(condition, accumulator);
      assert.strictEqual(output, "pouet");
    });
  });
});

class TrivialConditionProcessor extends DefaultConditionProcessor<Visitor<string>> {
  processCondition<P>(condition: Condition<P>, accumulator: Visitor<string>) {
    accumulator("(");

    let index: number = 0;
    for (const element of condition.elements) {
      if (index++ > 0) {
        accumulator(condition.operator);
      }
      this.processElement(element, condition, accumulator);
    }

    accumulator(")");
  }

  processPredicateSet<P>(predicates: P, condition: Condition<P>, accumulator: Visitor<string>): string {
    const result = Object.entries(predicates)
      .map((entry) => entry[0] + "=" + entry[1])
      .join(condition.operator);

    accumulator(result);

    return result;
  }
}
