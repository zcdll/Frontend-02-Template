// const find = (str) => {
//   const reg = /ab/;

//   return reg.test(str);
// };

const find = (str) => {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "a" && i < str.length - 1) {
      if (str[i + 1] === "b") {
        return true;
      }
    }
  }

  return false;
};

const findState = (str) => {
  let foundA = false;

  for (const char of str) {
    if (char === "a") {
      foundA = true;
    } else if (foundA && char === "b") {
      return true;
    } else {
      // 这里其实包含了很多种情况，比如
      // 1 foundA 为 true 时 char 不等于 b
      // 2 foundA 为 false 时 char 等于 b
      // 2 foundA 为 false 时 char 不等于 b
      foundA = false;
    }
  }

  return false;
};

// console.log(find("abd"), '---find("abd")');
console.log(findState("aabd"), '---findState("abd")');
