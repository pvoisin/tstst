import { Eventual } from "./eventual";

/**
 * Object able to read the specified type of data, independently of any context.
 *
 * @type T Type of the data to read.
 */
export interface Probe<T> {
  read(): Eventual<T>;
}
