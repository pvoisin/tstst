/**
 * Adds the specified prefix before the provided value.
 *
 * @param value Value which to add the prefix before.
 * @param prefix Prefix to add before the value.
 */
export function prefix(value: string, prefix: string): string {
  let result: string = value;

  if (value !== undefined && value !== null) {
    if (prefix !== undefined && prefix !== null) {
      result = prefix + value;
    }
  }

  return result;
}

/**
 * Adds the specified suffix after the provided value.
 *
 * @param value Value which to add the suffix after.
 * @param suffix Suffix to add after the value.
 */
export function suffix(value: string, suffix: string): string {
  let result: string = value;

  if (value !== undefined && value !== null) {
    if (suffix !== undefined && suffix !== null) {
      result += suffix;
    }
  }

  return result;
}

export function extract(subject: string, pattern: RegExp, strict: boolean = false): string[][] {
  let result = [];

  pattern = new RegExp(pattern.source, "g");
  let match: RegExpExecArray;
  let index: number = 0;
  while (subject.length > 0 && (match = pattern.exec(subject))) {
    if (strict && match.index > index) {
      result = null;
      break;
    }
    result.push(match.slice(1));
    index += match[0].length;
  }

  if (strict && index < subject.length) {
    result = null;
  }

  return result;
}
