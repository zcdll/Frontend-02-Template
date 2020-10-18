import { Component, STATE, ATTRIBUTE } from "./framework.js";
import { enableGesture } from "../Gesture/gesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease } from "./ease.js";

export { STATE, ATTRIBUTE } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = document.createElement("div");

    this.root.classList.add("carousel");

    for (const record of this[ATTRIBUTE].src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record.img})`;
      this.root.appendChild(child);
    }

    enableGesture(this.root);

    let timeline = new Timeline();

    timeline.start();

    let handler = null;

    let children = this.root.children;

    this[STATE].position = 0;

    let t = 0;
    let ax = 0;

    this.root.addEventListener("start", (event) => {
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 1500) {
        let progress = (Date.now() - t) / 500;
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener("tap", (event) => {
      this.triggerEvent("click", {
        position: this[STATE].postion,
        data: this[ATTRIBUTE].src[this[STATE].position],
      });
    });

    this.root.addEventListener("pan", (event) => {
      const x = event.clientX - event.startX - ax;

      const current = this[STATE].position - (x - (x % 500)) / 500;

      for (const offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    this.root.addEventListener("end", (event) => {
      // 重启
      timeline.reset();
      timeline.start();
      handler = setInterval(nextPicture, 1000);

      const x = event.clientX - event.startX - ax;

      const current = this[STATE].position - (x - (x % 500)) / 500;

      let direction = Math.round((x % 500) / 500);

      if (event.isFlick) {
        console.log(event.velocity, "---event.velocity");
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }

      for (const offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = "none";

        timeline.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      this[STATE].position =
        this[STATE].position - (x - (x % 500)) / 500 - direction;
      this[STATE].position =
        ((this[STATE].position % children.length) + children.length) %
        children.length;

      this.triggerEvent("Change", { position: this[STATE].position });
    });

    let nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (this[STATE].position + 1) % children.length;

      let current = children[this[STATE].position];
      let next = children[nextIndex];

      t = Date.now();

      timeline.add(
        new Animation(
          current.style,
          "transform",
          -this[STATE].position * 500,
          -500 - this[STATE].position * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      timeline.add(
        new Animation(
          next.style,
          "transform",
          500 - nextIndex * 500,
          -nextIndex * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      this[STATE].position = nextIndex;

      this.triggerEvent("Change", { position: this[STATE].position });
    };

    handler = setInterval(nextPicture, 1000);

    /*
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

  // mountTo(parent) {
  // parent.appendChild(this.render());
  // }
}
