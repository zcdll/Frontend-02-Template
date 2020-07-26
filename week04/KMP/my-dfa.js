// 确定有限自动状态机 版本实现

function buildDFA(str) {
  // 记录的是一个个状态，如果当前匹配失败了应该怎么办
  const result = new Array(str.length);

  for (let i = 0; i < result.length; i++) {
    result[i] = {};
  }

  result[0][str[0]] = 1;

  // 重启状态
  let x = 0;

  for (let i = 1; i < str.length; i++) {
    for (const char of str) {
      result[i][char] = result[x][char] || 0;
    }

    result[i][str[i]] = i + 1;
    x = result[x][str[i]] || 0;
  }

  return result;
}

function KMPMatchWithDFA(sourceStr, targetStr) {
  const dfa = buildDFA(targetStr);

  let sourceIndex = 0,
    targetIndex = 0;

  while (sourceIndex < sourceStr.length && targetIndex < targetStr.length) {
    // 下一个状态
    targetIndex = dfa[targetIndex][sourceStr[sourceIndex]] || 0;
    sourceIndex++;
  }

  if (targetIndex === targetStr.length) {
    console.log(sourceIndex - targetStr.length, "找到了");
  } else {
    console.log("没找到");
  }
}

KMPMatchWithDFA("BBC ABCDAB ABCDABCDABDE", "ABCDABD");
