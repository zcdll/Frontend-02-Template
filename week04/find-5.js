function match(string) {
  let state = start;

  for (const c of string) {
    state = state(c);
  }

  return state === end;
}

function start(c) {
  if (c === "a") {
    return foundA;
  } else {
    return start;
  }
}

function end(c) {
  return end;
}

function foundA(c) {
  if (c === "b") {
    return foundB;
  } else {
    return start(c);
  }
}

function foundB(c) {
  if (c === "c") {
    return foundC;
  } else {
    return start(c);
  }
}

function foundC(c) {
  if (c === "a") {
    return foundAA;
  } else {
    return start(c);
  }
}

function foundAA(c) {
  if (c === "b") {
    return foundBB;
  } else {
    return start(c);
  }
}

function foundBB(c) {
  if (c === "x") {
    return end;
  } else {
    return foundB(c);
  }
}

console.log(match("abcabx"), '---match("abcabx")');
console.log(match("abcabcabx"), '---match("abcabcabx")');
