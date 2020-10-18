import { Component, createElement } from "./framework.js";

import { Carousel } from "./carousel.js";
import { Timeline, Animation } from "./animation.js";
// document.body.appendChild(a);

const d = [
  {
    img: "https://i.loli.net/2020/09/23/Ci3punBNl7WSQa8.jpg",
    url: "https://www.google.com",
  },
  {
    img: "https://i.loli.net/2020/09/23/BLYAGFQ7v1nqmzU.jpg",
    url: "https://www.google.com",
  },
  {
    img: "https://i.loli.net/2020/09/23/EJRyWxHau23Si9r.jpg",
    url: "https://www.google.com",
  },
  {
    img: "https://i.loli.net/2020/09/23/EiguaA8VLphFXrw.jpg",
    url: "https://www.google.com",
  },
];

let a = (
  <Carousel
    src={d}
    onChange={(event) =>
      console.log(event.detail.position, "---event.detail.position")
    }
    onClick={(event) =>
      console.log(event.detail.data.url, "---event.detail.data.url")
    }
  />
);

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
