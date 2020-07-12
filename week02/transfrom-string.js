function transformString(str) {
  const result = []; // 最终结果保存的是 16进制，每个字符可能包含多位

  for (let i = 0; i < str.length; i++) {
    const currentCharacter = str.codePointAt(i); // 10进制
    console.log(currentCharacter, "---currentCharacter");

    // 0 - 7f 128 1位
    // 80 - 7ff 2047 2位
    // 800 - ffff 65535 3位
    // 10000 - 1fffff 2097151 4位
    // 200000 - 3ffffff 67108863 5位
    // 4000000 - 7fffffff 2147483647 6位
    // 5位 和 6位 的暂时应该话用不到

    if (currentCharacter <= parseInt("7f", 16)) {
      // 前 128 个 字符 占 1 位，直接转换
      result.push(currentCharacter.toString(16));
    } else if (currentCharacter <= parseInt("7ff", 16)) {
      // 80 - 7ff 占 2 位，需要拼接前缀
      const temp = currentCharacter.toString(2).padStart(11, "0");

      let first = "110" + temp.slice(0, 5);
      let second = "10" + temp.slice(5);

      result.push([
        parseInt(first, 2).toString(16),
        parseInt(second, 2).toString(16),
      ]);
    } else if (currentCharacter <= parseInt("ffff", 16)) {
      // 800 - ffff 占 3 位，需要拼接前缀
      const temp = currentCharacter.toString(2).padStart(16, "0");

      let first = "1110" + temp.slice(0, 4);
      let second = "10" + temp.slice(4, 10);
      let third = "10" + temp.slice(10, 16);

      result.push([
        parseInt(first, 2).toString(16),
        parseInt(second, 2).toString(16),
        parseInt(third, 2).toString(16),
      ]);
    } else if (currentCharacter <= parseInt("1fffff", 16)) {
      // 10000 - 1fffff 占 4 位，需要拼接前缀
      const temp = currentCharacter.toString(2).padStart(21, "0");

      let first = "11110" + temp.slice(0, 3);
      let second = "10" + temp.slice(3, 9);
      let third = "10" + temp.slice(9, 15);
      let fourth = "10" + temp.slice(15, 21);

      result.push([
        parseInt(first, 2).toString(16),
        parseInt(second, 2).toString(16),
        parseInt(third, 2).toString(16),
        parseInt(fourth, 2).toString(16),
      ]);
    } else if (currentCharacter <= parseInt("3ffffff", 16)) {
      // 200000 - 3ffffff 占 5 位，需要拼接前缀
      const temp = currentCharacter.toString(2).padStart(26, "0");

      let first = "111110" + temp.slice(0, 2);
      let second = "10" + temp.slice(2, 8);
      let third = "10" + temp.slice(8, 14);
      let fourth = "10" + temp.slice(14, 20);
      let fifth = "10" + temp.slice(20, 26);

      result.push([
        parseInt(first, 2).toString(16),
        parseInt(second, 2).toString(16),
        parseInt(third, 2).toString(16),
        parseInt(fourth, 2).toString(16),
        parseInt(fifth, 2).toString(16),
      ]);
    } else if (currentCharacter <= parseInt("7fffffff", 16)) {
      // 4000000 - 7fffffff 占 6 位，需要拼接前缀
      const temp = currentCharacter.toString(2).padStart(31, "0");

      let first = "1111110" + temp.slice(0, 1);
      let second = "10" + temp.slice(1, 7);
      let third = "10" + temp.slice(7, 13);
      let fourth = "10" + temp.slice(13, 19);
      let fifth = "10" + temp.slice(19, 25);
      let sixth = "10" + temp.slice(25, 31);

      result.push([
        parseInt(first, 2).toString(16),
        parseInt(second, 2).toString(16),
        parseInt(third, 2).toString(16),
        parseInt(fourth, 2).toString(16),
        parseInt(fifth, 2).toString(16),
        parseInt(sixth, 2).toString(16),
      ]);
    }

    if (parseInt(currentCharacter, 10) > 65535) {
      console.log("222");
      i++;
    }
  }

  console.log(result, "---result");

  return result;
}

// const str = "𠮷";𐀀
// const str = "\u{0}\u{7f}\u{80}\u{7ff}\u{800}\u{ffff}\u{10000}\u{1fffff}\u{200000}\u{3ffffff}\u{4000000}\u{7fffffff}";
// const str = "\u{0}\u{7f}\u{80}\u{7ff}\u{800}\u{ffff}𐀀";
// 1 21, 7e 7fa, 800 fffc, 1000 1fa90 1f660
const str = "" + "!" + "~" + "ߺ" + "ࠀ" + "￼" + "𐀀" + "🪐" + "😀";
transformString(str);
