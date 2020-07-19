const set = new Set(); // 用来去重的

const globalProperties = [
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "Date",
  "RegExp",
  "Promise",
  "Proxy",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Function",
  "Boolean",
  "String",
  "Number",
  "Symbol",
  "Object",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Atomics",
  "JSON",
  "Math",
  "Reflect",
];

const queue = []; // 递归 或者说 广度优先搜索 时暂时存储数据的队列，队列为空时表示找完了

const result = [];

for (const p of globalProperties) {
  queue.push({
    path: [p],
    object: this[p], // 这里的 this 就是全局对象
  });
}

let current;

while (queue.length) {
  current = queue.shift();

  result.push(current);

  console.log(current.path.join("."), "---current.path.join(.)");

  if (set.has(current.object)) continue; // 重复的 object 跳过

  set.add(current.object);

  for (let propertyName of Object.getOwnPropertyNames(current.object)) {
    /**
     * getOwnPropertyDescriptor 或者说 defineProperty 可以有六种参数
     * 分两大类，数据描述符 存取描述符
     * 数据描述符
     * 1. configurable
     * 2. enumerable
     * 3. value
     * 4. writable
     * 存取描述符
     * 1. configurable
     * 2. enumerable
     * 3. get
     * 4. set
     */

    // 当前 object 所有的 property
    const property = Object.getOwnPropertyDescriptor(
      current.object,
      propertyName
    );

    if (
      property.hasOwnProperty("value") &&
      typeof property.value === "object" &&
      property.value instanceof Object
    ) {
      queue.push({
        path: current.path.concat([propertyName]),
        object: property.value,
      });
    }

    if (property.hasOwnProperty("get") && typeof property.get === "function") {
      queue.push({
        path: current.path.concat([propertyName]),
        object: property.get,
      });
    }

    if (property.hasOwnProperty("set") && typeof property.set === "function") {
      queue.push({
        path: current.path.concat([propertyName]),
        object: property.set,
      });
    }
  }
}

console.log(queue.length, "---queue.length");
console.log(set.size, "---set.size"); // 427
console.log(set, "---set");
console.log(result, "---result");
