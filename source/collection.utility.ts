import * as _ from "lodash";
import { Dictionary } from "lodash";

export interface Dictionary<T = any> {
  [key: string]: T;
}

export type Collection<T> = Dictionary<T> | Array<T>;

export function getCartesianProduct(...vectors: any[]): any[] {
  return _.reduce(
    vectors,
    (accumulator, vector) =>
      _.flatten(_.map(accumulator, (product) => _.map(vector, (value) => product.concat([value])))),
    [[]] // accumulator, initially
  );
}

/**
 * Tells whether the provided value is or can be considered empty.
 *
 * Following types are always considered *NOT* empty: boolean, number, function, RegExp.
 *
 * @example
 * • isEmpty('') → true
 * • isEmpty('…') → false
 * • isEmpty({}) → true
 * • isEmpty([]) → true
 * • isEmpty(null) → true
 * • isEmpty(undefined) → true
 * • isEmpty(true) → false
 * • isEmpty(/^$/) → false
 *
 * @param collection Collection to remove the empty values from.
 * @param #removeEmptyValues
 */
// Rationale: Lodash's `#isEmpty` only deals with collections...
export function isEmpty(value: any): boolean {
  // Easy cases:
  let result: boolean = value === undefined || value === null || value === "" || undefined;

  const valueType = typeof value;

  // Some types just can't be "empty":
  if (result === undefined) {
    if (
      valueType === "boolean" ||
      valueType === "number" ||
      valueType === "function" ||
      value instanceof RegExp ||
      value instanceof Date ||
      value instanceof Error
    ) {
      result = false;
    }
  }

  // Case of collections - leverage `_.size`:
  if (result === undefined && isCollection(value)) {
    result = _.isEmpty(value);
  }

  // Finally, if still not determined, return whether the value is "falsy":
  return result !== undefined ? result : !value;
}

/** Tells whether the provided value is or can be considered as a collection. */
export function isCollection(value: any): boolean {
  return _.isObjectLike(value) || _.isArrayLike(value) || value instanceof Map || value instanceof Set;
}

/**
 * Removes empty values from the given collection.
 *
 * @example
 * • removeEmptyValues({A: 'a', B: '', C: null, D: 'd', E: undefined, F: true}) → {A: 'a', D: 'd', F: true}
 *
 * @param collection Collection from which to remove the empty values.
 *
 * @see #isEmpty
 */
export function removeEmptyValues<T, C extends Collection<T>>(collection: C): C {
  return filter(collection, (value) => !isEmpty(value));
}

/**
 * Removes missing values from the given collection.
 *
 * @example
 * • removeMissingValues({A: 'a', B: '', C: null, D: 'd', E: undefined, F: true}) → {A: 'a', B: '', D: 'd', F: true}
 *
 * @param collection Collection from which to remove the missing values.
 */
export function removeMissingValues<T, C extends Collection<T>>(collection: C): C {
  return filter(collection, (value) => !_.isNil(value));
}

/**
 * Filters the given collection using the provided predicate.
 *
 * @param collection Collection from which to filter the values.
 */
export function filter<T, C extends Collection<T>>(collection: C, predicate: (item: T) => boolean): C {
  let result: any;

  if (_.isArray(collection)) {
    result = _.filter(collection, predicate);
  } else {
    result = _.pickBy(collection, predicate);
  }

  return result;
}

const DEFAULT_ITEM_MAPPER = (value: any, index: number) => String(index);

/**
 * Maps the items of the provided collection using the given mapper.
 *
 * @param collection Collection of which to map the items.
 * @param mapper Function used to make the keys of the resulting map.
 */
export function getItemMap<T>(
  collection: Array<T>,
  mapper: (value: T, index?: number) => string = DEFAULT_ITEM_MAPPER
): Dictionary<T> {
  return _.transform(
    collection,
    (accumulator, value, index) => {
      const key = mapper(value, index);
      accumulator[key] = value;
    },
    {}
  );
}

/**
 * Tells whether the provided model is matching with the expected model.
 *
 * @example
 *  • isMatching({'A': 1, 'B': 2, 'C': 3}, {'A': 1, 'B': true}) // → false
 *  • isMatching({'A': 1, 'B': true, 'C': 3}, {'A': 1, 'B': true}) // → true
 *
 * @param model Model to check.
 * @param expectedModel Structure composed of fixed values, describing what the model should be matching with.
 * @param keyFilter Keys of the fields to consider for the operation.
 */
export function isMatching(model: any, expectedModel: any, keyFilter?: string[]): boolean {
  let _expectedModel = expectedModel;
  if (!isEmpty(keyFilter)) {
    _expectedModel = _.pick(expectedModel, keyFilter);
  }

  return _.isMatch(model, _expectedModel);
}

export type CompatibilityRuleSet = { [key: string]: (value: any) => boolean };

/**
 * Tells whether the provided model is compatible with the expected model.
 *
 * This method is very similar to `#isMatching` but also offers the ability to
 * specify rules (predicates) instead of fixed values only.
 *
 * @example
 *  • isCompatible({'A': 1, 'B': 2, 'C': 3}, {'A': 1, 'B': _.isBoolean}) // → false
 *  • isCompatible({'A': 1, 'B': true, 'C': 3}, {'A': 1, 'B': _.isBoolean}) // → true
 *
 * @param model Model to check.
 * @param expectedModel Structure composed of both fixed values and rules, describing what the model should be matching with.
 * @param keyFilter Keys of the fields to consider for the operation.
 */
export function isCompatible(model: any, expectedModel: any, keyFilter?: string[]): boolean {
  const modelSubSet: any = {};
  const _expectedModel: any = {};
  const compatibilityRules: CompatibilityRuleSet = {};

  let isCompatibleRulesEmpty: boolean = true;
  _.forEach(expectedModel, (value, key) => {
    if (isEmpty(keyFilter) || (keyFilter && key in keyFilter)) {
      if (typeof value !== "function") {
        _expectedModel[key] = value;
      } else {
        compatibilityRules[key] = value;
        modelSubSet[key] = model[key];
        isCompatibleRulesEmpty = false;
      }
    }
  });

  let result = _.isMatch(model, _expectedModel);
  if (!isCompatibleRulesEmpty) {
    result = result && _.conformsTo(modelSubSet, compatibilityRules);
  }

  return result;
}
