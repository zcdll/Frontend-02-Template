const css = require("css");

const EOF = Symbol("EOF");

const layout = require("./layout");

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [
  {
    type: "document",
    children: [],
  },
];

let rules = [];

function addCSSRules(text) {
  const ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, "    "), "---ast");
  rules.push(...ast.stylesheet.rules);
}

/**
 * 这里假设 selector 都是简单选择器，假设 class 只有一个
 *
 * 作业 实现复合选择器，实现支持空格的 Class 选择器
 *     当 class 中包含多个的时候，只要有一个符合就可以
 * @param {*} element
 * @param {*} selector
 */
function match(element, selector) {
  // 用 attributes 判断是否是文本节点，是文本节点的话可以直接忽略
  if (!selector || !element.attributes) {
    return false;
  }

  if (selector.charAt(0) === "#") {
    const attr = element.attributes.filter((attr) => attr.name === "id")[0];

    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    // 理论上来说，这里需要考虑 class
    const attr = element.attributes.filter((attr) => attr.name === "class")[0];

    // 实现复合选择器，实现支持空格的 Class 选择器
    // 当 class 中包含多个的时候，只要有一个符合就可以
    if (attr && attr.value) {
      const attrClasses = attr.value.split(" ");

      if (attrClasses.includes(selector.replace(".", ""))) {
        return true;
      }
    }

    // if (attr && attr.value === selector.replace(".", "")) {
    //   return true;
    // }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }

  return false;
}

function specificity(selector) {
  const p = [0, 0, 0, 0];
  const selectorParts = selector.split(" ");

  for (const part of selectorParts) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }

  return p;
}

function compareSpecificity(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }

  return sp1[3] - sp2[3];
}

// 复杂，复合，简单
// 复杂选择器 := 复合选择器 + separator(' ')
// 复合选择器 := Array<简单选择器> // 针对一个元素
// 简单选择器 := element selector | attribute selector | id selector
// 计算当前元素的 CSS
function computeCSS(element) {
  console.log(rules, "---rules");
  console.log("compute CSS for Element", element);
  // slice 会复制原数组
  // reverse 是为了生成 CSS 需要的顺序，例如 html body div，reverser() 之后为 div body html
  const elements = stack.slice().reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    // 这里 reverse 是为了和上面的顺序一致
    const selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) continue;

    let matched = false;

    let j = 1;

    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      // 如果匹配到，我们要加入
      console.log("Element ", element, "matched rule ", rule);
      const sp = specificity(rule.selectors[0]);
      const computedStyle = element.computedStyle;

      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          // 新来的 sp 更大，则替换
          compareSpecificity(
            computedStyle[declaration.property].specificity,
            sp
          ) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}

// 每个 token 的出口
function emit(token) {
  // if(token.type !== 'text')
  // console.log(token, "---token");
  // if (token.type === "text") {
  //   return;
  // }
  let top = stack[stack.length - 1];

  if (token.type === "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p !== "type" && p !== "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    computeCSS(element);

    top.children.push(element);
    element.parent = top;

    // 自封闭的标签不用配对，所以就不用入栈了
    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === "endTag") {
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      // 遇到 style 标签时，执行添加 CSS 规则的曹走
      // 这里只支持 style 标签，不支持 link 标签
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content);
      }

      layout(top);

      stack.pop();
    }

    currentTextNode = null;
  } else if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };

      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

// 每个 token 的入口
function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 自封闭标签 和 非自封闭标签 都会走这里，区别是 自封闭的 token 会多一个 isSelfClosing=true 的属性
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === ">") {
    return data;
  } else if (c === EOF) {
  } else {
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c; //.toLowerCase();
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };

    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === ">") {
    // todo
    // emit(currentToken);
    // return data;
  } else {
    return unquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function unquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === "EOF") {
  } else {
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;

  for (const c of html) {
    state = state(c);
    // console.log(state, "---state");
  }

  state = state(EOF);

  console.log(stack[0], "---stack[0]");

  return stack[0];
};
