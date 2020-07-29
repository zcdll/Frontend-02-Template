function getStyle(element) {
  if (element.style) {
    element.style = {};
  }

  for (const prop in element.computedStyle) {
    console.log(prop, "---prop");
    if (element.computedStyle.hasOwnProperty(prop)) {
      const p = element.computedStyle.value;

      element.style[prop] = element.computedStyle[prop].value;

      if (element.style[prop].toString().match(/px$/)) {
        element.style[prop] = parseInt(element.style[prop]);
      }

      if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
        element.style[prop] = parseInt(element.style[prop]);
      }
    }
  }

  return element.style;
}

function layout(element) {
  if (!element.computedStyle) return;

  const elementStyle = getStyle(element);

  if (elementStyle.display !== "flex") return;

  // 过滤掉文本节点，只剩下 element
  const items = element.children.filter((item) => item.type === "element");

  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  const style = elementStyle;

  // 去掉 width 和 height 的 auto 值 以及 空值
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });

  // 重置这几个属性的默认值
  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.alignItems || style.alignItems === "auto") {
    style.alignItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent === "flex-start";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowarp";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }

  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;

  if (style.flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }

  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }

  if (style.flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.height;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexWrap === "wrap-reverse") {
    const temp = crossStart;
    crossStart = crossEnd;
    crossEnd = temp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  let isAutoMainSize = false;
  if (!style[mainSize]) {
    // auto sizing
    elementStyle[mainSize] = 0;

    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[main] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize].value; // todo 这里不对
      }
    }

    isAutoMainSize = true;

    // style.flexWrap = "nowarp";
  }

  let flexLine = []; // 一行，可能含有多个 element
  const flexLines = [flexLine]; // 多个行

  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] < style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }

      mainSpace -= itemStyle[mainSize];
    }
  }

  flexLine.mainSpace = mainSpace; // 写循环的技巧

  console.log(items, "---items");

  if (style.flexWrap === "nowarp" || isAutoMainSize) {
    flexLine.crossSpace =
      style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  if (mainSpace < 0) {
    // overflow (happens only if container is single line), scale every item
    const scale = style[mainSize] / (style[mainSize] - mainSize);
    let currentMain = mainBase;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // process each flex line
    flexLines.forEach((items) => {
      const mainSpace = items.mainSpace;
      let flexTotal = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStyle = getStyle(item);

        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }

      if (flexTotal > 0) {
        // There is flexible flex items
        let currentMain = mainBase;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // There is *NO* flexible flex items, which means, justifyContent should work
        if (style.justifyContent === "flex-start") {
          let currentMain = mainBase;
          let step = 0;
        }
        if (style.justifyContent === "flex-end") {
          let currentMain = mainSpace * mainSize + mainBase;
          let step = 0;
        }
        if (style.justifyContent === "center") {
          let currentMain = (mainSpace / 2) * mainSign + mainBase;
          let step = 0;
        }
        if (style.justifyContent === "space-between") {
          let step = (mainSpace / (item.length - 1)) * mainSign;
          let currentMain = mainBase;
        }
        if (style.justifyContent === "space-around") {
          let step = (mainSpace / item.length) * main;
          let currentMain = step / 2 + mainBase;
        }
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          // const itemStyle = getStyle(item);

          itemStyle[(mainStart, currentMain)];
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }
}

module.exports = layout;
