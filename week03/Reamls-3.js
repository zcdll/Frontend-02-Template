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
    type: "global",
  });
}

let current;

while (queue.length) {
  current = queue.shift();

  result.push({ path: current.path, type: current.type });

  // console.log(current.path.join("."), "---current.path.join(.)");

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
        type: "value",
      });
    }

    if (property.hasOwnProperty("get") && typeof property.get === "function") {
      queue.push({
        path: current.path.concat([propertyName]),
        object: property.get,
        type: "get",
      });
    }

    if (property.hasOwnProperty("set") && typeof property.set === "function") {
      queue.push({
        path: current.path.concat([propertyName]),
        object: property.set,
        type: "set",
      });
    }
  }
}

console.log(queue.length, "---queue.length");
console.log(set.size, "---set.size"); // 427
console.log(set, "---set");
console.log(result, "---result");

//  整理数据
const data = [];

// 先整理长度为 1 的项
result.forEach((item) => {
  if (item.path.length === 1) {
    data.push({
      name: item.path[0],
      id: item.path[0],
      type: item.type,
      children: [],
    });
  }
});

// 再整理长度为 2 的项
result.forEach((item) => {
  if (item.path.length === 2) {
    const index = data.findIndex((target) => item.path[0] === target.name);

    if (index > -1) {
      data[index].children.push({
        name: item.path[1],
        id: `${item.path[0]}.${item.path[1]} ${item.type}`,
        type: item.type,
        children: [],
      });
    }
  }
});

// 最后整理长度为 3 的项
result.forEach((item) => {
  if (item.path.length === 3) {
    data.forEach((target, targetIndex) => {
      if (item.path[0] === target.name) {
        target.children.forEach((child, childIndex) => {
          if (item.path[1] === child.name) {
            data[targetIndex].children[childIndex].children.push({
              name: item.path[2],
              id: `${item.path[0]}.${item.path[1]}.${item.path[2]} ${item.type}`,
              type: item.type,
              children: [],
            });
          }
        });
      }
    });
  }
});

console.log(data, "---data");
