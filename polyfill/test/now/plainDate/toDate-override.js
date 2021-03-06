// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.now.plaindate
includes: [compareArray.js]
---*/

const actual = [];
const expected = [
  "get Temporal.TimeZone.from",
  "call Temporal.TimeZone.from",
  "get timeZone.getPlainDateTimeFor",
  "call timeZone.getPlainDateTimeFor",
];
const dateTime = Temporal.PlainDateTime.from("1963-07-02T12:34:56.987654321");

Object.defineProperty(Temporal.PlainDateTime.prototype, "toPlainDate", {
  get() {
    actual.push("get Temporal.PlainDateTime.prototype.toPlainDate");
    return function() {
      actual.push("call Temporal.PlainDateTime.prototype.toPlainDate");
    };
  },
});

const timeZone = new Proxy({
  getPlainDateTimeFor(instant) {
    actual.push("call timeZone.getPlainDateTimeFor");
    assert.sameValue(instant instanceof Temporal.Instant, true, "Instant");
    return dateTime;
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

Object.defineProperty(Temporal.TimeZone, "from", {
  get() {
    actual.push("get Temporal.TimeZone.from");
    return function(argument) {
      actual.push("call Temporal.TimeZone.from");
      assert.sameValue(argument, "UTC");
      return timeZone;
    };
  },
});

const result = Temporal.now.plainDate("iso8601", "UTC");
assert.notSameValue(result, undefined);
assert.sameValue(result instanceof Temporal.PlainDate, true);
for (const property of ["year", "month", "day"]) {
  assert.sameValue(result[property], dateTime[property], property);
}

assert.compareArray(actual, expected);
