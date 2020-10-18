import { Component, createElement } from "./framework.js";
import { Carousel } from "./Carousel.js";
import { Button } from "./Button.js";
import { List } from "./List.js";

const d = [
  "https://i.loli.net/2020/09/23/Ci3punBNl7WSQa8.jpg",
  "https://i.loli.net/2020/09/23/BLYAGFQ7v1nqmzU.jpg",
  "https://i.loli.net/2020/09/23/EJRyWxHau23Si9r.jpg",
  "https://i.loli.net/2020/09/23/EiguaA8VLphFXrw.jpg",
];

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
