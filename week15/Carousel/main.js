// import { Component, createElement } from "./framework.js";
import { createElement } from "./framework.js";

import { Carousel } from "./Carousel.js";
import { Button } from "./Button.js";
import { List } from "./List.js";
// import { Timeline, Animation } from "./animation.js";
// document.body.appendChild(a);

const d = [
  {
    img: "https://i.loli.net/2020/09/23/Ci3punBNl7WSQa8.jpg",
    url: "https://www.google.com",
    title: "dog1",
  },
  {
    img: "https://i.loli.net/2020/09/23/BLYAGFQ7v1nqmzU.jpg",
    url: "https://www.google.com",
    title: "dog2",
  },
  {
    img: "https://i.loli.net/2020/09/23/EJRyWxHau23Si9r.jpg",
    url: "https://www.google.com",
    title: "dog3",
  },
  {
    img: "https://i.loli.net/2020/09/23/EiguaA8VLphFXrw.jpg",
    url: "https://www.google.com",
    title: "dog4",
  },
];

// let a = (
//   <Carousel
//     src={d}
//     onChange={(event) =>
//       console.log(event.detail.position, "---event.detail.position")
//     }
//     onClick={(event) =>
//       console.log(event.detail.data.url, "---event.detail.data.url")
//     }
//   />
// );

// let a = <Button>content </Button>;

let a = (
  <List data={d}>
    {(record) => (
      <div>
        <img src={record.img} />
        <a href={record.url}>{record.title}</a>
      </div>
    )}
  </List>
);

a.mountTo(document.body);

// const tl = new Timeline();

// window.tl = tl;
// window.animation = new Animation(
//   {
//     set a(v) {
//       console.log(v, "---v");
//     },
//   },
//   "a",
//   0,
//   100,
//   1000,
//   null
// );

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

// tl.start();
