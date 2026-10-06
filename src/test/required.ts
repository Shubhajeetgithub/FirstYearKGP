/**
 * Returns `value`, or fails the test when it is null/undefined. DOM lookups return
 * `T | null`; the JS tests dereferenced them directly and would fail with a TypeError.
 */
export function required<T>(value: T | null | undefined, what = "value"): T {
  if (value == null) throw new TypeError(`expected ${what} to exist`);
  return value;
}
