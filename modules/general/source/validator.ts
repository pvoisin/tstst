import { Visitor } from "./visitor";

/**
 * Function telling whether the provided value is valid.
 *
 * @type T Type of the data to validate.
 */
export type Validator<T = unknown> = Visitor<T, boolean>;
