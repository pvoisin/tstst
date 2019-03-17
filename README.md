


# TypeScript, the Simple Things!

This package offers utility functions & objects for easy manipulation of strings, dates, quantities, amounts, units, collections, etc.
It leverages popular libraries like [LoDash](https://lodash.com/) & [Moment.js](https://momentjs.com/) and complements them with more advanced features.

## Strings

### `#prefix` & `#suffix`

Prefix & suffix like a boss! `null` & `undefined` with simply be ignored... Hassle-free!

### `#extract(subject: string, pattern: RegExp)`

Iteratively extracts parts of the provided string using a regular expression. You won't have to write those "find" loops anymore! *You're welcome*...

## Collections

Note: `C`, below, is like: `<T, C extends Dictionary<T> | Array<T>>`.

### `#isEmpty(value: any): boolean`

### `#isCollection(value: any): boolean`

### `#filter(collection: C, predicate: (item: T) => boolean): C`

### `#removeEmptyValues(collection: C): C`

### `#removeMissingValues(collection: C): C`

### `#getItemMap(collection: Array<T>, mapper: (value: T, index?: number) => string): Dictionary<T>`

### `#isMatching(model: any, expectedModel: any)`

### `#isCompatible(model: any, expectedModel: any)`

### `#getCartesianProduct`
Yes, you sometimes need that and once you've checked what's out there you usually end up writing it for yourself... so I'm sharing!

- `getCartesianProduct(["A", "B", "C"], [1, 2, 3])`
  → `[["A", 1], ["A", 2], ["A", 3], ["B", 1], ["B", 2], ["B", 3], ["C", 1], ["C", 2], ["C", 3]]`

By the way, that's very cool for testing with lots of value combinations...

## Dates

### `#isDate` & `#isDateRange`

### `#isDateBetween`

### `#isDateCompatible`

### `#getSafeDate` & `#getSafeDateRange`

### `#getDateRangeAround`

### `ISO_DATE_PATTERN`

Here's one lovely date pattern ❤️ that you can use with various validation libraries! It'll capture the interesting bits for you; for example:
- `ISO_DATE_PATTERN.exec("2018-07-31T12:34:56.789+10:11").slice(1)`
  → `["2018-07-31", "-", "12:34:56", ":", "789", "+10:11"]`

And as simple as things are, Moment.js supports anything that conforms to that pattern... so you're all covered!

## Quantities, Units & Amounts

Few objects are provided for you to define new quantities & units easily. Check it out!

- `Quantity`, `Unit`, `Unitscale`, `Amount`;
- `#getUnitForSymbol(symbol: string, quantity: Quantity): Unit`
- `#convertAmount(amount: Amount, unit: IUnit): number`
- `#registerUnitConversion(unit1: Unit, unit2: Unit, conversion: (amount: number) => number)`
- `TIME`, `TIME_UNIT_SCALE`, `NANOSECOND`, `MICROSECOND`, `MILLISECOND`, `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`
- `DATA_SIZE`, `DATA_SIZE_UNIT_SCALE`, `BIT`, `BYTE`, `KILOBIT`, `KILOBYTE`, `MEGABIT`, `MEGABYTE`, `GIGABIT`, `GIGABYTE`, ` TERABIT`, `TERABYTE`

### `#parseAmount`

Very useful for configuration settings, for example - no need to comment about what the unit is anymore!

- `parseAmount("+1s 2w-3d", SECOND)`
  → `{value: 950401, unit: SECOND}`
- `parseAmount("8b1B2kB", BYTE)`
  → `{value: 2002, unit: BYTE}`
