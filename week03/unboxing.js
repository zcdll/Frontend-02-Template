const o = {
  toString() {
    return "2";
  },
  valueOf() {
    return 1;
  },
  [Symbol.toPrimitive]() {
    return 3;
  },
};

console.log(o.toString(), "---o.toString()");

const x = {};
x[o] = 1;

console.log(x, "---x");

console.log("x" + o, "---x+o");
