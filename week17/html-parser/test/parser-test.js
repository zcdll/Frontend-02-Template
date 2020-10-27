var assert = require("assert");

import { parseHTML } from "../src/parser";

// var add = require("../add").add;
// var multiple = require("../add").multiple;

describe("parse HTML:", () => {
  it("<a></a>", function () {
    const tree = parseHTML("<a></a>");
    // console.log(tree, "---tree");

    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href='//google.com'></a>", function () {
    const tree = parseHTML('<a href="//google.com"></a>');
    // console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href ></a>", function () {
    const tree = parseHTML("<a href ></a>");
    // console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a href id></a>", function () {
    const tree = parseHTML("<a href id></a>");
    // console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="//google.com" id></a>', function () {
    const tree = parseHTML('<a href="//google.com" id></a>');
    // console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a id=abc></a>", function () {
    const tree = parseHTML("<a id=abc></a>");
    console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a id=abc/>", function () {
    const tree = parseHTML("<a id=abc/>");
    console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a id='abc'/>", function () {
    const tree = parseHTML("<a id='abc'/>");
    // console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<a />", function () {
    const tree = parseHTML("<a />");
    // console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<A /> uppercase", function () {
    const tree = parseHTML("<A />");
    // console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<>", function () {
    const tree = parseHTML("<>");
    console.log(tree, "---tree");

    // assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, "text");
  });
});
