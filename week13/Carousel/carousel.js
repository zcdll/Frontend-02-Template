import { Component, createElement } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");

    this.root.classList.add("carousel");

    for (const record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    let position = 0;
    this.root.addEventListener("mousedown", (event) => {
      let children = this.root.children;
      let startX = event.clientX;

      const move = (event) => {
        const x = event.clientX - startX;

        // let current = position - Math.round((x - (x % 500)) / 500);
        let current = position - (x - (x % 500)) / 500;

        for (const offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = "none";
          children[pos].style.transform = `translate(${
            -pos * 500 + offset * 500 + (x % 500)
          }px)`;
        }
      };

      const up = (event) => {
        const x = event.clientX - startX;

        position = position - Math.round(x / 500);

        for (const offset of [
          0,
          -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x)),
        ]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = "";
          children[pos].style.transform = `translate(${
            -pos * 500 + offset * 500
          }px)`;
        }

        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    /*
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];
      let next = children[nextIndex];

      next.style.transition = "none";
      next.style.transform = `translateX(${100 - 100 * nextIndex}%)`;

      setTimeout(() => {
        next.style.transition = ""; //  置为空会让 class 中的样式生效
        current.style.transform = `translateX(${-100 - 100 * currentIndex}%)`;
        next.style.transform = `translateX(${-100 * nextIndex}%)`;

        currentIndex = nextIndex;
      }, 16);
    }, 1000);
    */

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
