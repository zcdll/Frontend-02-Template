# 题目

```
为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
```

[CSS 标准中关于 first-letter 和 first-line 的部分](https://drafts.csswg.org/selectors-3/#first-line)

我理解的是：

首先，`::first-line` 必须用在 块级元素中

> In CSS, the ::first-line pseudo-element can only have an effect when attached to a block-like container such as a block box, inline-block, table-caption, or table-cell. In such a case, it refers to the first formatted line of that container.

然后，在父级确定以及第一行的内容确定后，`::first-line` 已经不能更改第一行的内容了，也就是说，文档流已经定下来了，具体哪部分要应用`::first-line`设置的样式，应该是已经确定下来了。

所以，`::first-line` 不能设置 float 之类的。
