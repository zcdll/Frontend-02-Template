var assert = require("assert");

import { add, multiple } from "../add";

// var add = require("../add").add;
// var multiple = require("../add").multiple;

describe("add function testing", () => {
  it("2+3 shoule be equal to 5", function () {
    assert.equal(add(2, 3), 5);
  });
  it("-1+2 shoule be equal to 1", function () {
    assert.equal(add(-1, 2), 1);
  });
  it("7+9 shoule be equal to 16", function () {
    assert.equal(add(7, 9), 15);
  });

  it("7*9 shoule be equal to 63", function () {
    assert.equal(multiple(7, 9), 63);
  });
});
