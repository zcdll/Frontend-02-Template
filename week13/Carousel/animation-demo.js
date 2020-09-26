import { Timeline, Animation } from "./animation.js";
import { ease, easeIn, easeInOut, easeOut } from "./ease.js";

const tl = new Timeline();

tl.start();

tl.add(
  new Animation(
    document.querySelector("#el").style,
    "transform",
    0,
    500,
    2000,
    easeInOut,
    0,
    (v) => {
      // console.log(v, "---v");
      return `translateX(${v}px)`;
    }
  )
);

document
  .querySelector("#pause-btn")
  .addEventListener("click", () => tl.pause());

document
  .querySelector("#resume-btn")
  .addEventListener("click", () => tl.resume());

document.querySelector("#el2").style.transition = "transform ease-in-out 2s";
document.querySelector("#el2").style.transform = "translateX(500px)";
