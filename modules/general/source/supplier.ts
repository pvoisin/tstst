import { Provider } from "./provider";

/**
 * Object able to supply data of the specified type.
 *
 * @type T Type of the data to provide.
 */
export interface Supplier<T> extends Provider<void, T> {
  (...options: unknown[]): T;
}
