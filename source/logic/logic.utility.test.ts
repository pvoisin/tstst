import { assert } from "chai";
import {
  Condition,
  ConditionElement,
  getCondition,
  isConjunctionExpression,
  isDisjunctionExpression,
  isExpression,
  isNegationExpression,
  isOperationExpression,
  normalizeCondition,
  normalizeOperatorSymbol,
  Operator,
} from ".";
import { isObject } from "..";
import { highlightValueRepresentation as hvr } from "../test.utility";

const FIELDS = {
  value: [1, 2, 3],
  flag: false,
  missing: null,
  date: new Date(),
  // prettier-ignore
  "&": [
    { "|": [
      { categoryId: 123 },
      { categoryType: ["book", "magazine"] },
    ]},
    { "|": [
      { "~": { description: "fish" }},
      { description: null}
    ]},
  ]
};

const EQUAL_PREDICATE_EXPRESSION = { "=": [{ A: [1, 2, 3] }] };
const DIFFERENT_PREDICATE_EXPRESSION = { "!=": [{ B: [4, 5, 6] }] };
const CONJUNCTION_EXPRESSION = {
  "&": [EQUAL_PREDICATE_EXPRESSION, DIFFERENT_PREDICATE_EXPRESSION],
};
const DISJUNCTION_EXPRESSION = {
  "|": [EQUAL_PREDICATE_EXPRESSION, DIFFERENT_PREDICATE_EXPRESSION],
};
const NEGATION_EXPRESSION = {
  "!": EQUAL_PREDICATE_EXPRESSION,
};
const EXPRESSIONS = [NEGATION_EXPRESSION, CONJUNCTION_EXPRESSION, DISJUNCTION_EXPRESSION];

describe("#normalizeOperatorSymbol", () => {
  it("should work properly", () => {
    assert.strictEqual(normalizeOperatorSymbol("!"), Operator.NOT);
    assert.strictEqual(normalizeOperatorSymbol("¬"), Operator.NOT);
    assert.strictEqual(normalizeOperatorSymbol("&&"), Operator.AND);
    assert.strictEqual(normalizeOperatorSymbol("&"), Operator.AND);
    assert.strictEqual(normalizeOperatorSymbol("∧"), Operator.AND);
    assert.strictEqual(normalizeOperatorSymbol("·"), Operator.AND);
    assert.strictEqual(normalizeOperatorSymbol("||"), Operator.OR);
    assert.strictEqual(normalizeOperatorSymbol("|"), Operator.OR);
    assert.strictEqual(normalizeOperatorSymbol("∨"), Operator.OR);
    assert.strictEqual(normalizeOperatorSymbol("+"), Operator.OR);
  });
});

describe("#isExpression", () => {
  it("should work properly", () => {
    assert.isTrue(isExpression({ X: [1, 2, 3] }));
    assert.isFalse(isExpression({ X: [1, 2, 3], Y: [4, 5, 6] }), "Expressions should only have one key!");

    assert.isTrue(isExpression(NEGATION_EXPRESSION));
    assert.isTrue(isExpression(NEGATION_EXPRESSION, { "!": isObject }));
    assert.isFalse(isExpression(NEGATION_EXPRESSION, { "&": isObject }));
    assert.isFalse(isExpression(NEGATION_EXPRESSION, { "|": isObject }));

    assert.isTrue(isExpression(CONJUNCTION_EXPRESSION));
    assert.isFalse(isExpression(CONJUNCTION_EXPRESSION, { "!": isObject }));
    assert.isTrue(isExpression(CONJUNCTION_EXPRESSION, { "&": isObject }));
    assert.isFalse(isExpression(CONJUNCTION_EXPRESSION, { "|": isObject }));

    assert.isTrue(isExpression(DISJUNCTION_EXPRESSION));
    assert.isFalse(isExpression(DISJUNCTION_EXPRESSION, { "!": isObject }));
    assert.isFalse(isExpression(DISJUNCTION_EXPRESSION, { "&": isObject }));
    assert.isTrue(isExpression(DISJUNCTION_EXPRESSION, { "|": isObject }));
  });
});

describe("#isOperationExpression", () => {
  it("should work properly", () => {
    assert.isFalse(isOperationExpression({ X: [1, 2, 3] }), "Operation expressions should only have known operators!");

    assert.isTrue(isOperationExpression(NEGATION_EXPRESSION));
    assert.isTrue(isOperationExpression(CONJUNCTION_EXPRESSION));
    assert.isTrue(isOperationExpression(DISJUNCTION_EXPRESSION));
  });
});

const WRONG_EXPRESSIONS = [
  FIELDS,
  { "!": FIELDS },
  { "!": [] },
  { "!": [FIELDS] },
  { "&": FIELDS },
  { "&": [] },
  { "&": [FIELDS] },
  { "|": FIELDS },
  { "|": [] },
  { "|": [FIELDS] },
];

describe("#isNegationExpression", () => {
  const expectations: Map<any, boolean> = new Map();
  WRONG_EXPRESSIONS.forEach((expression) => expectations.set(expression, false));
  expectations.set({ "!": NEGATION_EXPRESSION }, true);
  expectations.set({ "!": CONJUNCTION_EXPRESSION }, true);
  expectations.set({ "!": DISJUNCTION_EXPRESSION }, true);
  expectations.set({ "!": EXPRESSIONS }, false);
  expectations.set({ "&": NEGATION_EXPRESSION }, false);
  expectations.set({ "&": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "&": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "&": EXPRESSIONS }, false);
  expectations.set({ "|": NEGATION_EXPRESSION }, false);
  expectations.set({ "|": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "|": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "|": EXPRESSIONS }, false);

  expectations.forEach((expectedResult: boolean, expression: any) => {
    it(`should return ${hvr(expectedResult)} for ${hvr(expression)}`, () => {
      assert.strictEqual(isNegationExpression(expression), expectedResult);
    });
  });
});

describe("#isConjunctionExpression", () => {
  const expectations: Map<any, boolean> = new Map();
  WRONG_EXPRESSIONS.forEach((expression) => expectations.set(expression, false));
  expectations.set({ "!": NEGATION_EXPRESSION }, false);
  expectations.set({ "!": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "!": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "!": EXPRESSIONS }, false);
  expectations.set({ "&": NEGATION_EXPRESSION }, false);
  expectations.set({ "&": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "&": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "&": EXPRESSIONS }, true);
  expectations.set({ "|": NEGATION_EXPRESSION }, false);
  expectations.set({ "|": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "|": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "|": EXPRESSIONS }, false);

  expectations.forEach((expectedResult: boolean, expression: any) => {
    it(`should return ${hvr(expectedResult)} for ${hvr(expression)}`, () => {
      assert.strictEqual(isConjunctionExpression(expression), expectedResult);
    });
  });
});

describe("#isDisjunctionExpression", () => {
  const expectations: Map<any, boolean> = new Map();
  WRONG_EXPRESSIONS.forEach((expression) => expectations.set(expression, false));
  expectations.set({ "!": NEGATION_EXPRESSION }, false);
  expectations.set({ "!": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "!": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "!": EXPRESSIONS }, false);
  expectations.set({ "&": NEGATION_EXPRESSION }, false);
  expectations.set({ "&": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "&": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "&": EXPRESSIONS }, false);
  expectations.set({ "|": NEGATION_EXPRESSION }, false);
  expectations.set({ "|": CONJUNCTION_EXPRESSION }, false);
  expectations.set({ "|": DISJUNCTION_EXPRESSION }, false);
  expectations.set({ "|": EXPRESSIONS }, true);

  expectations.forEach((expectedResult: boolean, expression: any) => {
    it(`should return ${hvr(expectedResult)} for ${hvr(expression)}`, () => {
      assert.strictEqual(isDisjunctionExpression(expression), expectedResult);
    });
  });
});
/*
const expression = {
  "|": [
    { "!": { "=": [{ A: [1, 2, 3] }] } },
    { "&": [{ "=": [{ A: [1, 2, 3] }] }, { "!=": [{ B: [4, 5, 6] }] }] },
    { "|": [{ "=": [{ A: [1, 2, 3] }] }, { "!=": [{ B: [4, 5, 6] }] }] },
  ],
};
//*/
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

      assert.deepStrictEqual(
        condition,
        // prettier-ignore
        {
          operator: Operator.AND,
          elements: [
            {
              'ANIMAL.breed': '*shepard',
              'OWNER.id': 34087346
            },
            {
              operator: Operator.NOT,
              elements: [
                { 'PERMIT.acknowledged': null }
              ]
            },
            {
              operator: Operator.OR,
              elements: [
                { expiryDate: null },
                { expiryDate: [null, date] }
              ]
            }
          ]
        }
      );
    });

    it("with logical operator symbol variations", () => {
      const date = new Date();
      const condition = getCondition({
        // prettier-ignore
        "&": [
          {
            "∧": {
              "ANIMAL.breed": "*shepard",
              "OWNER.id": 34087346,
            },
            "¬": {
              "PERMIT.acknowledged": null,
            },
            "|": [
              { expiryDate: null },
              { expiryDate: [null, date] }
            ],
            "∨": [
              { expiryDate: null },
              { expiryDate: [date, null] }
            ]
          },
        ]
      });

      assert.deepStrictEqual(
        condition,
        // prettier-ignore
        {
          operator: Operator.AND,
          elements: [
            {
              'ANIMAL.breed': '*shepard',
              'OWNER.id': 34087346
            },
            {
              operator: Operator.NOT,
              elements: [
                { 'PERMIT.acknowledged': null }
              ]
            },
            {
              operator: Operator.OR,
              elements: [
                { expiryDate: null },
                { expiryDate: [null, date] }
              ]
            },
            {
              operator: Operator.OR,
              elements: [
                { expiryDate: null },
                { expiryDate: [date, null] }
              ]
            }
          ]
        }
      );
    });

    it("with condition having special predicates", () => {
      const date = new Date();
      const condition = getCondition({
        "&&": [
          {
            "~": { "ANIMAL.breed": "*shepard" },
            "≠": { "OWNER.id": 34087346 },
            "!": {
              "PERMIT.acknowledged": null,
            },
            // prettier-ignore
            "||": [
              { expiryDate: null },
              { expiryDate: [null, date] }
            ]
          },
        ],
      });
      assert.deepStrictEqual(
        condition,
        // prettier-ignore
        {
          operator: Operator.AND,
          elements: [
            {
              "~": { "ANIMAL.breed": "*shepard" },
              "≠": { "OWNER.id": 34087346 }
            },
            {
              operator: Operator.NOT,
              elements: [
                { 'PERMIT.acknowledged': null }
              ]
            },
            {
              operator: Operator.OR,
              elements: [
                { expiryDate: null },
                { expiryDate: [null, date] }
              ]
            }
          ]
        }
      );
    });

    it("with others...", () => {
      const date = new Date();

      const EXPRESSION1 = {
        value: [1, 2, 3],
        flag: false,
        missing: null,
        date,
        // prettier-ignore
        "&": [
          {"|": {
            categoryId: 123 ,
            categoryType: ["book", "magazine"] ,
          }},
          {"|": {
            "~": { description: "fish" },
            description: null
          }},
        ]
      };
      assert.deepStrictEqual(getCondition(EXPRESSION1), {
        operator: Operator.AND,
        elements: [
          {
            value: [1, 2, 3],
            flag: false,
            missing: null,
            date,
          },
          {
            operator: Operator.OR,
            elements: [
              {
                categoryId: 123,
                categoryType: ["book", "magazine"],
              },
            ],
          },
          {
            operator: Operator.OR,
            elements: [
              {
                "~": {
                  description: "fish",
                },
                description: null,
              },
            ],
          },
        ],
      });

      // prettier-ignore
      const EXPRESSION2 = {
        "&": [
          { "{}": ["value", 1, 2, 3] },
          { "=": ["flag", false] },
          { "=": ["missing", null] },
          { "=": ["date", date] },
        ],
      };
      assert.deepStrictEqual(getCondition(EXPRESSION2), {
        operator: Operator.AND,
        elements: [
          {
            "{}": ["value", 1, 2, 3],
            "=": ["flag", false],
          },
          { "=": ["missing", null] },
          { "=": ["date", date] },
        ],
      });

      // prettier-ignore
      const EXPRESSION3 = {
        "&": [
          { "()": ["value", 1, 2, 3] },
          { "=": ["flag", false] },
          { "=": ["missing", null] },
          { "=": ["date", date] },
        ],
      };
      assert.deepStrictEqual(getCondition(EXPRESSION3), {
        operator: Operator.AND,
        elements: [
          {
            "()": ["value", 1, 2, 3],
            "=": ["flag", false],
          },
          { "=": ["missing", null] },
          { "=": ["date", date] },
        ],
      });
    });
  });

  function AND(...elements: ConditionElement<any>[]): Condition<any> & { operator: Operator.AND } {
    return { operator: Operator.AND, elements };
  }
  function OR(...elements: ConditionElement<any>[]): Condition<any> & { operator: Operator.OR } {
    return { operator: Operator.OR, elements };
  }

  describe("#simplifyCondition", () => {
    it("with conjunction having redundant predicates", () => {
      assert.deepStrictEqual(
        // prettier-ignore
        normalizeCondition(
          AND(
            { A: 1, B: 2 },
            { A: 1, B: 2 },
            { A: 1, B: 2 }
          )
        ),
        { A: 1, B: 2 }
      );
    });

    it("with conjunction having different predicates", () => {
      assert.deepStrictEqual(
        // prettier-ignore
        normalizeCondition(
          AND(
            { A: 1, B: 2 },
            { C: 3, D: 4 }
          ),
        ),
        {
          A: 1,
          B: 2,
          C: 3,
          D: 4,
        }
      );
    });

    it("with disjunction having overlapping predicates", () => {
      assert.deepStrictEqual(
        // prettier-ignore
        normalizeCondition(
          OR(
            { A: 1, B: 2 },
            { C: 3, D: 4 },
            { A: -1 },
            { C: -3 },
            { B: -2, D: -4 },
            { A: 10, B: 20, C: 30, D: 40 }
          ),
        ),
        {
          operator: Operator.OR,
          elements: [
            {
              A: 1,
              B: 2,
              C: 3,
              D: 4,
            },
            {
              A: -1,
              B: -2,
              C: -3,
              D: -4,
            },
            {
              A: 10,
              B: 20,
              C: 30,
              D: 40,
            },
          ],
        }
      );
    });

    it("with disjunction having overlapping predicates & conditions", function() {
      this.timeout(9999999999);

      // prettier-ignore
      assert.deepStrictEqual(
        normalizeCondition({
          operator: Operator.OR,
          elements: [
            { A: 1, B: 2, C: 3 },
            { D: 4, E: 5, F: 6 },
            AND({ A: -1, C: -3 }),
            { D: -4 },
            OR({ B: -2, E: -5 }),
            { A: 10, B: 20, C: 30, D: 40, E: 50, F: 60 },
          ],
        }),
        {
          operator: Operator.OR,
          elements: [
            { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 },
            { A: 10, B: -2, C: 30, D: -4, E: -5, F: 60 },
            { B: 20, D: 40, E: 50 },
            AND({ A: -1, C: -3 }),
          ],
        }
      );
    });

    it("with complex disjunction having overlapping predicates & conditions", () => {
      // prettier-ignore
      assert.deepStrictEqual(
        normalizeCondition(
          OR(
            { A: 1, B: 2, C: 3 },
            { D: 4, E: 5, F: 6 },
            AND({ A: -1 }),
            { D: -4 },
            OR({ B: -2, E: -5 }),
            { A: 10, B: 20, C: 30, D: 40, E: 50, F: 60 },
          )
        ),
        {
          operator: Operator.OR,
          elements: [
            { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 },
            { A: -1, B: -2, C: 30, D: -4, E: -5, F: 60 },
            { A: 10, B: 20, D: 40, E: 50 },
          ],
        }
      );
    });

    it("with trivial idempotent conjunction branch", () => {
      assert.deepStrictEqual(
        normalizeCondition(
          // prettier-ignore
          AND(
            AND(
              AND(
                 { A: 1, B: 2},
                 { C: 3 },
              )
            )
          )
        ),
        { A: 1, B: 2, C: 3 }
      );
    });

    it("with trivial idempotent disjunction branch", () => {
      assert.deepStrictEqual(
        normalizeCondition(
          // prettier-ignore
          OR(
            OR(
              OR(
                { A: 1, B: 2},
                { C: 3 },
              )
            )
          )
        ),
        {
          operator: Operator.OR,
          elements: [{ A: 1, B: 2, C: 3 }],
        }
      );
    });

    it("with complex idempotent disjunction branch", () => {
      // prettier-ignore
      assert.deepStrictEqual(
        normalizeCondition(
          OR(
            OR(
              OR(
                { A: 1, B: 2, C: 3 },
              ),
              { D: 4, E: 5, F: 6 },
            ),
            { A: -1 },
            { D: -4 },
          )
        ),
        {
          operator: Operator.OR,
          elements: [
            {A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 },
            { A: -1, D: -4 }
          ],
        }
      );
    });

    it("with idempotent conjunction mixed branch & only predicates", () => {
      assert.deepStrictEqual(
        // prettier-ignore
        normalizeCondition(
          AND(
            OR(
              AND(
                { A: 1, B: 2 },
                { C: 3 },
                { D: 4 }
              ),
            ),
          ),
        ),
        {
          A: 1,
          B: 2,
          C: 3,
          D: 4,
        }
      );
    });

    it("with idempotent disjunction mixed branch & only predicates", () => {
      assert.deepStrictEqual(
        // prettier-ignore
        normalizeCondition(
          OR(
            AND(
              OR(
                { A: 1, B: 2 },
                { C: 3 },
                { D: 4 }
              ),
            ),
          ),
        ),
        {
          operator: Operator.OR,
          elements: [{ A: 1, B: 2, C: 3, D: 4 }],
        }
      );
    });

    it("with idempotent conjunction mixed branch & trivial conditions", () => {
      // prettier-ignore
      assert.deepStrictEqual(
        normalizeCondition(
          AND(
            OR(
              AND(
                { A: 1 },
                OR({ B: 2 }),
                { C: 3 },
                AND({ D: 4 }),
              ),
            ),
          ),
        ),
        { A: 1, B: 2, C: 3, D: 4 }
      );
    });

    it("with idempotent disjunction mixed branch & trivial conditions", () => {
      // prettier-ignore
      assert.deepStrictEqual(
        normalizeCondition(
          OR(
            AND(
              OR(
                { A: 1 },
                OR({ B: 2 }),
                { C: 3 },
                AND({ D: 4 }),
              ),
            ),
          ),
        ),
        {
          operator: Operator.OR,
          elements: [{ A: 1, B: 2, C: 3, D: 4 }],
        }
      );
    });

    it("with idempotent conjunction mixed branch & non-trivial conditions", () => {
      // prettier-ignore
      assert.deepStrictEqual(
        normalizeCondition(
          AND(
            OR(
              AND(
                { A: 1 },
                OR({ B: 2 }, { B: -2 }),
                { C: 3 },
                AND({ D: 4 }, { D: -4 }),
              ),
            ),
          ),
        ),
        {
          operator: Operator.AND,
          elements: [
            { A: 1, C: 3, D: 4 },
            { D: -4 },
            OR({ B: 2 },{ B: -2 })],
        }
      );
    });

    it("with mixed operation branch", () => {
      // prettier-ignore
      assert.deepStrictEqual(
        normalizeCondition(
          AND(
            OR(
              AND({ A: 1, B: 2 })
            ),
            { C: 3 },
            { D: 4 }
          )
        ),
        { A: 1, B: 2, C: 3, D: 4 }
      );
    });

    it("with overlapping predicates", () => {
      assert.deepStrictEqual(
        normalizeCondition<any>({
          operator: Operator.AND,
          elements: [
            {
              operator: Operator.OR,
              elements: [
                {
                  operator: Operator.AND,
                  elements: [{ D: 4, E: 5 }],
                },
              ],
            },
            { D: -4, F: 6 },
          ],
        }),
        {
          operator: Operator.AND,
          elements: [{ D: 4, E: 5, F: 6 }, { D: -4 }],
        }
      );
    });
  });
});
