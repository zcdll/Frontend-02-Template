/**
 * 转换字符串为数字
 * @param {*} str 输入的字符串
 * @param {*} base 进制
 * base = 10 时，需要考虑 . 和 e 指数 的情况，其余不需考虑
 * 需要考虑的因素，进制、科学技术法、加减号
 *
 * 这里不使用 Number parseInt 等函数
 * 所以使用 codePointAt 来找出某一个字符对应的数值是多少
 */
const stringToNumber = (str, base) => {
  if (!str) {
    return null;
  }

  let sign = ""; // 整体部分的加减号
  let result = 0; // 最终结果
  let digits = 1; // 小数位数
  let exponent = 0; // e指数位数
  let exponentSign = ""; // 指数部分的加减号

  const chars = str.split("");

  let i = 0;

  if (chars[0] === "+") {
    i++;
  }
  if (chars[0] === "-") {
    sign = "-";
    i++;
  }

  // 计算整数部分
  for (; i < chars.length; i++) {
    if (chars[i] === "." || chars[i] === "e") {
      // 这里  i 不自增，是为了方便在下面判断 . 和 e 哪个先出来
      break;
    }

    result = result * base;

    // 兼容 十六进制 abcdf 字符
    if (chars[i].codePointAt(0) > "9".codePointAt(0)) {
      result += chars[i].codePointAt(0) - "a".codePointAt(0) + 10;
    } else {
      result += chars[i].codePointAt(0) - "0".codePointAt(0);
    }
  }

  // 非 十进制 的话，只需要计算到这里
  if (base !== 10) {
    return sign ? -result : result;
  }

  // 计算 十进制
  // 计算小数部分
  if (chars[i] === ".") {
    i++;

    for (; i < chars.length; i++) {
      if (chars[i] === "e") {
        // 这里  i 不自增，是为了 处理 11e1 这种没有 . 的情况
        break;
      }
      digits = digits / base;
      result += (chars[i].codePointAt(0) - "0".codePointAt(0)) * digits;
    }
  }

  // 计算指数部分
  if (chars[i] === "e") {
    i++;
    for (; i < chars.length; i++) {
      if (chars[i] === "-") {
        exponentSign = "-";
        continue;
      }
      // 这里必须全是数字
      exponent = exponent * base;
      exponent += chars[i].codePointAt(0) - 48;
    }
  }

  result = sign ? -result : result;

  // 取整
  result = Math.round(result * (1 / digits)) / (1 / digits);

  result = result * Math.pow(10, exponentSign ? -exponent : exponent);

  return result;
};

console.log(stringToNumber("1f", 16), "31---stringToNumber(100.523)");
console.log(stringToNumber("11", 8), "9---stringToNumber(-100.523)");
console.log(stringToNumber("11", 2), "3---stringToNumber(-100.523)");
console.log(stringToNumber("100.1", 10), "100.1---stringToNumber(-100e-1)");
console.log(
  stringToNumber("-100.112", 10),
  "-100.112---stringToNumber(100.112)"
);
console.log(stringToNumber("100e1", 10), "1000---stringToNumber(100e1)");
console.log(stringToNumber("100.1e1", 10), "1001---stringToNumber(100.1e1)");
console.log(stringToNumber("-100.1e1", 10), "-1001---stringToNumber(-100.1e1)");
console.log(
  stringToNumber("-100.1e-1", 10),
  "-10.01---stringToNumber(-100.1e-1)"
);
console.log(
  stringToNumber("-100.123e-3", 10),
  "-0.100123---stringToNumber(-100.123e-3)"
);
console.log(
  stringToNumber("-100.123e5", 10),
  "-10012300---stringToNumber(-100.123e5)"
);
