/**
 * 检查元素是否复合选择器
 *
 * 1. 选择器按照 空格 分段
 * 2. 从后开始往前检查，是否符合每一段的选择器
 *
 * 默认
 * 1. 每段 元素选择器 只能在开头
 * 2. 最多只有一个 id，且 id 选择器 在 class 选择器的前面
 * 3. 可以有多个 class
 * 4. 考虑属性选择器
 * 5. 元素选择器可以是 *
 * 6. todo 复杂选择器的情况 > ~ + ||
 *
 * div
 * div.c1.c2
 * div#id.c1.c2.c3
 * div.c1#id.c2.c3
 * #id
 * #id.c1.c2
 * .c1.c2
 * .c1.c2#id.c3.c4
 *
 * @param {*} selector
 * @param {*} element
 */
function match(selector, element) {
  if (!selector || !element) {
    return false;
  }

  const selectorParts = selector.split(" ");

  let currentElement = element;

  for (i = selectorParts.length - 1; i >= 0; i--) {
    if (!check(selectorParts[i], currentElement)) {
      return false;
    }

    currentElement = currentElement.parentNode;
  }

  return true;
}

function check(selector, element) {
  // 有属性选择器的时候，先检查 属性选择器，因为 属性选择器 可以出现在任意位置
  if (selector.includes("[")) {
    if (!checkAttribute(selector, element)) {
      return false;
    }
  }

  if (selector.charAt(0) === "#") {
    return checkID(selector, element);
  } else if (selector.charAt(0) === ".") {
    return checkClasses(selector, element);
  } else {
    return checkTagName(selector, element);
  }

  return false;
}

function checkID(selector, element) {
  const test = selector.match(/#([\w-]+)/);

  if (test && test[1] === element.id) {
    if (selector.includes(".")) {
      return checkClasses(selector, element);
    }

    return true;
  }
  return false;
}

function checkClasses(selector, element) {
  const test = selector.match(/\.([\w-]+)/g);

  // [".c1", ".c2"] 需要是 element.classList 的子集
  if (test) {
    for (let i = 0; i < test.length; i++) {
      // 一项不存在就返回 false， 需要全部在 classList 中
      if (!Array.from(element.classList).includes(test[i].replace(".", ""))) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function checkTagName(selector, element) {
  const test = selector.match(/[a-zA-Z]+[^\.#]/);

  if (selector === "*") {
    return true;
  }

  if (test && test[0].toLowerCase() === element.tagName.toLowerCase()) {
    // 这里可以用 includes 或者 charAt(0)
    if (selector.includes("#")) {
      return checkID(selector, element);
    }

    if (selector.includes(".")) {
      return checkClasses(selector, element);
    }

    return true;
  }

  return false;
}

function checkAttribute(selector, element) {
  const test = [...selector.matchAll(/\[([\w-]+)=([\w-]+)\]/g)];

  if (test && test.length > 0) {
    for (let i = 0; i < test.length; i++) {
      if (!(element.getAttribute(test[i][1]) === test[i][2])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

const result = match(
  "body div#id1 #id.class.c1.c2[name=test]",
  document.getElementById("id")
);

console.log(result, "---result");
