// 转换十六进制数字为字符
const hexSwitch = (number) => {
  switch (number) {
    case 10:
      return "a";
    case 11:
      return "b";
    case 12:
      return "c";
    case 13:
      return "d";
    case 14:
      return "e";
    case 15:
      return "f";
  }
};

// 获得十进制小数的 小数部分长度
const getDecimalsLength = (number) => {
  let result = 0;

  while (number - Math.floor(number) !== 0) {
    result++;
    number *= 10;
  }

  return result;
};

/**
 * 十进制小数转为 base进制字符串
 * 先分成整数部分和小数部分
 * 不用考虑 e，因为在分成 整数部分 和 小数部分 时，这个会自动转换
 * @param {*} num
 * @param {*} base
 */
const numberToString = (num, base) => {
  const decimalsLength = getDecimalsLength(num);

  let integer = Math.floor(num); // 整体的整数部分
  let decimals = (num - integer).toFixed(decimalsLength); // 整体的小数部分

  // 处理整数部分
  let integerResult = "";

  while (integer) {
    let tempRemainder = integer % base;

    if (base === 16 && tempRemainder > 9) {
      integerResult = hexSwitch(tempRemainder) + integerResult;
    } else {
      integerResult = tempRemainder + integerResult;
    }

    integer = Math.floor(integer / base);
  }

  if (!integerResult) {
    integerResult = "0";
  }

  // 处理小数部分
  let decimalsResult = "";

  let decimalsInteger = 0;
  let decimalsDecimals = decimals;

  while (decimalsDecimals) {
    decimalsInteger = Math.floor(decimalsDecimals * base);
    decimalsDecimals = decimalsDecimals * base - decimalsInteger;

    if (base === 16 && decimalsInteger > 9) {
      decimalsResult += hexSwitch(decimalsInteger);
    } else {
      decimalsResult += decimalsInteger;
    }
  }

  if (base === 10) {
    decimalsResult = decimalsResult.slice(0, decimalsLength);
  }

  if (decimalsResult.length > 0) {
    return integerResult + "." + decimalsResult;
  }

  return integerResult;
};

console.log(numberToString(20, 10), "20---numberToString(20, 10)");
console.log(numberToString(20, 16), "14---numberToString(20, 16)");
console.log(numberToString(20, 2), "10100---numberToString(20, 2)");
console.log(numberToString(20, 8), "24---numberToString(20, 8)");

console.log(numberToString(20.25, 10), "20.25---numberToString(20.25, 10)");
console.log(
  numberToString(20.25, 2),
  `${(20.25).toString(2)}---numberToString(20.25, 2)`
);
console.log(
  numberToString(20.25, 16),
  `${(20.25).toString(16)}---numberToString(20.25, 16)`
);
console.log(
  numberToString(20.25, 8),
  `${(20.25).toString(8)}---numberToString(20.25, 8)`
);

console.log(numberToString(20.1, 10), "20.1---numberToString(20.1, 10)");
console.log(
  numberToString(20.113213, 10),
  `${(20.113213).toString(10)}---numberToString(20.1, 10)`
);

console.log(
  numberToString(20.1, 2),
  `${(20.1).toString(2)}---numberToString(20.1, 2)`
);
console.log(
  numberToString(10.1, 16),
  `${(10.1).toString(16)}---numberToString(10.1, 16)`
);
console.log(
  numberToString(20.1, 16),
  `${(20.1).toString(16)}---numberToString(20.1, 16)`
);
console.log(
  numberToString(20.1, 8),
  `${(20.1).toString(8)}---numberToString(20.1, 8)`
);
console.log(
  numberToString(20.1, 16),
  `${(20.1).toString(16)}---numberToString(20.1, 16)`
);
console.log(
  numberToString(20.1, 2),
  `${(20.1).toString(2)}---numberToString(20.1, 2)`
);
console.log(
  numberToString(20.1, 8),
  "24.0631463146314632---numberToString(20.1, 8)"
);

console.log(
  numberToString(12e1, 10),
  `${(12e1).toString(10)}---numberToString(12e1, 10)`
);

console.log(
  numberToString(12.123e1, 10),
  `${(12.123e1).toString(10)}---numberToString(12.123e1, 10)`
);

console.log(
  numberToString(12.531e-3, 10),
  `${(12.531e-3).toString(10)}---numberToString(12.531e-3, 10)`
);
