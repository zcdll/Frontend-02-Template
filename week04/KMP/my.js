// 普通版本实现
/**
 * 构建 部分匹配值表
 * @param {string} str
 */
function buildPartialMatchTable(str) {
  if (str.length === 0) {
    return [];
  }

  const result = [];

  for (let i = 0; i < str.length; i++) {
    if (i === 0) {
      result.push(0);
    } else {
      const slice = str.slice(0, i + 1);
      const prefix = [];
      const suffix = [];

      for (let j = 0; j < slice.length; j++) {
        if (j === 0) {
          prefix.push(slice.slice(0, j + 1));
        } else if (j === slice.length - 1) {
          suffix.push(slice.slice(j, slice.length));
        } else {
          prefix.push(slice.slice(0, j + 1));
          suffix.push(slice.slice(j, slice.length));
        }
      }

      // prefix suffix 取交集中的最大长度
      let maxLength = 0;

      prefix.forEach((item) => {
        if (suffix.includes(item)) {
          maxLength = Math.max(maxLength, item.length);
        }
      });

      result.push(maxLength);
    }
  }

  return result;
}

// const partialMatchTable = buildPartialMatchTable("ABCDABD");

/**
 * KMP 算法匹配字符串
 * @param {string} sourceStr 源字符串
 * @param {string} targetStr 目标字符串
 */
function kmpMatch(sourceStr, targetStr) {
  if (sourceStr.length === 0) {
    return;
  }

  const partialMatchTable = buildPartialMatchTable(targetStr);

  console.log(partialMatchTable, "---partialMatchTable");

  //源字符串 查找时的索引值
  let sourceIndex = 0;
  //目标字符串 查找时的索引值
  let targetIndex = 0;

  let temp = "";

  while (sourceIndex < sourceStr.length) {
    if (sourceStr[sourceIndex] === targetStr[targetIndex]) {
      temp += targetStr[targetIndex];

      if (targetIndex === targetStr.length - 1) {
        console.log(sourceIndex, "找到了---sourceIndex");
        console.log(targetIndex, "找到了---targetIndex");

        console.log(
          `找到了，sourceStr 的索引范围为[${sourceIndex - targetIndex}, ${
            sourceIndex - 1
          }]`
        );
        console.log(temp, "---temp");
        return;
      }

      sourceIndex++;
      targetIndex++;
    } else {
      temp = "";
      if (targetIndex === 0) {
        sourceIndex++;
      } else {
        targetIndex = partialMatchTable[targetIndex - 1];
        temp += targetStr.slice(0, targetIndex);
      }
    }
  }

  console.log(sourceIndex, "没找到---sourceIndex");
  console.log(targetIndex, "没找到---targetIndex");
}

kmpMatch("BBC ABCDAB ABCDABCDABDE", "ABCDABDE");
