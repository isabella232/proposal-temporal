// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-get-temporal.timezone.prototype.id
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get timeZone.toString",
  "call timeZone.toString",
];

const timeZone = new Proxy({
  toString() {
    actual.push("call timeZone.toString");
    return "time zone";
  },
}, {
  has(target, property) {
    actual.push(`has timeZone.${property}`);
    return property in target;
  },
  get(target, property) {
    actual.push(`get timeZone.${property}`);
    return target[property];
  },
});

const descriptor = Object.getOwnPropertyDescriptor(Temporal.TimeZone.prototype, "id");
const result = descriptor.get.call(timeZone);
assert.sameValue(result, "time zone");

assert.compareArray(actual, expected);
