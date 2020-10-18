import { Component, createElement } from "./framework.js";

import { Carousel } from "./carousel.js";
import { Timeline, Animation } from "./animation.js";
// document.body.appendChild(a);

const d = [
  "https://i.loli.net/2020/09/23/Ci3punBNl7WSQa8.jpg",
  "https://i.loli.net/2020/09/23/BLYAGFQ7v1nqmzU.jpg",
  "https://i.loli.net/2020/09/23/EJRyWxHau23Si9r.jpg",
  "https://i.loli.net/2020/09/23/EiguaA8VLphFXrw.jpg",
];

let a = <Carousel src={d} />;

a.mountTo(document.body);

const tl = new Timeline();

window.tl = tl;
window.animation = new Animation(
  {
    set a(v) {
      console.log(v, "---v");
    },
  },
  "a",
  0,
  100,
  1000,
  null
);

// tl.add(
//   new Animation(
//     {
//       set a(v) {
//         console.log(v, "---v");
//       },
//     },
//     "a",
//     0,
//     100,
//     1000,
//     null
//   )
// );

tl.start();
