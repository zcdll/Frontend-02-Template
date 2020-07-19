const set = new Set();

const queue = [
  eval,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  Array,
  Date,
  RegExp,
  Promise,
  Proxy,
  Map,
  WeakMap,
  Set,
  WeakSet,
  Function,
  Boolean,
  String,
  Number,
  Symbol,
  Object,
  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
  ArrayBuffer,
  SharedArrayBuffer,
  DataView,
  Float32Array,
  Float64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8ClampedArray,
  Atomics,
  JSON,
  Math,
  Reflect,
];

let current;

while (queue.length) {
  current = queue.shift();

  if (set.has(current)) continue;
  // console.log(current, "---current");

  set.add(current);

  // console.log(current, "---current");

  for (let p of Object.getOwnPropertyNames(current)) {
    // console.log(p, "---p");
    // console.log(current[p], "---current[p]");
    const property = Object.getOwnPropertyDescriptor(current, p);

    if (property.hasOwnProperty("value") && property.value instanceof Object) {
      queue.push(property.value);
    }

    if (property.hasOwnProperty("get") && property.get instanceof Object) {
      console.log(property.get, "---property.get");
      queue.push(property.get);
    }

    if (property.hasOwnProperty("set") && property.set instanceof Object) {
      queue.push(property.set);
    }
  }
}

console.log(set.size, "---set.size"); // 427
