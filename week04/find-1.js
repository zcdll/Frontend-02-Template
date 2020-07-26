// const findA = (str) => {
//   return str.indexOf("a");
// };

const find = (str) => {
  for (const char of str) {
    if (char === "a") {
      return true;
    }
  }
  return false;
};

console.log(find("123a"), '---find("123a")');
