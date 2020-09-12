let all = [
  "CSSImageValue",
  "CSSKeywordValue",
  "CSSMathInvert",
  "CSSMathMax",
  "CSSMathMin",
  "CSSMathNegate",
  "CSSMathProduct",
  "CSSMathSum",
  "CSSMathValue",
  "CSSMatrixComponent",
  "CSSNumericArray",
  "CSSNumericValue",
  "CSSPerspective",
  "CSSPositionValue",
  "CSSRotate",
  "CSSScale",
  "CSSSkew",
  "CSSSkewX",
  "CSSSkewY",
  "CSSStyleValue",
  "CSSTransformComponent",
  "CSSTransformValue",
  "CSSTranslate",
  "CSSUnitValue",
  "CSSUnparsedValue",
  "CSSVariableReferenceValue",
  "StylePropertyMap",
  "StylePropertyMapReadOnly",
];

all = all.map((item) => {
  return item.split(" ")[1];
});

console.log(all, "---all");

console.log(all.length, "---all.length");
