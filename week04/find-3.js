const find = (str) => {
  let foundA = false;
  let foundB = false;
  let foundC = false;
  let foundD = false;
  let foundE = false;

  for (const char of str) {
    if (char === "a") {
      foundA = true;
    } else if (foundA && char === "b") {
      foundB = true;
    } else if (foundB && char === "c") {
      foundC = true;
    } else if (foundC && char === "d") {
      foundD = true;
    } else if (foundD && char === "e") {
      foundE = true;
    } else if (foundE && char === "f") {
      return true;
    } else {
      foundA = false;
      foundB = false;
      foundC = false;
      foundD = false;
      foundE = false;
    }
  }

  return false;
};

const find1 = (str) => {
  let foundA = false;
  let foundB = false;
  let foundC = false;
  let foundD = false;
  let foundE = false;

  for (const char of str) {
    if (char === "a") {
      if (foundB || foundC || foundD || foundE) {
        foundA = false;
        foundB = false;
        foundC = false;
        foundD = false;
        foundE = false;

        continue;
      } else {
        foundA = true;
      }
    } else if (foundA && char === "b") {
      if (!foundB) {
        foundB = true;
      } else {
        foundA = false;
        foundB = false;
        foundC = false;
        foundD = false;
        foundE = false;

        continue;
      }
    } else if (foundB && char === "c") {
      if (!foundC) {
        foundC = true;
      } else {
        foundA = false;
        foundB = false;
        foundC = false;
        foundD = false;
        foundE = false;

        continue;
      }
    } else if (foundC && char === "d") {
      if (!foundD) {
        foundD = true;
      } else {
        foundA = false;
        foundB = false;
        foundC = false;
        foundD = false;
        foundE = false;

        continue;
      }
    } else if (foundD && char === "e") {
      if (!foundE) {
        foundE = true;
      } else {
        foundA = false;
        foundB = false;
        foundC = false;
        foundD = false;
        foundE = false;

        continue;
      }
    } else if (foundE && char === "f") {
      return true;
    } else {
      foundA = false;
      foundB = false;
      foundC = false;
      foundD = false;
      foundE = false;
    }
  }

  return false;
};

console.log(find("abcdef"), "---find(abcdef)");
console.log(find("12abbc"), "---find(12abcddefabcde)");
console.log(find("abcbddef"), "---find(abcddef)");
console.log(find("12abcddefabcdef"), "---find(12abcddefabcdef)");
console.log(find("abacdef"), "---find(abacdef)");

console.log(find1("abcdef"), "---find1(abcdef)");
console.log(find1("12abbc"), "---find1(12abcddefabcde)");
console.log(find1("abcbddef"), "---find1(abcddef)");
console.log(find1("12abcddefabcdef"), "---find1(12abcddefabcdef)");
console.log(find1("abacdef"), "---find1(abacdef)");
