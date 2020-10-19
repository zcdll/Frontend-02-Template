import { Component, STATE, ATTRIBUTE, createElement } from "./framework.js";
import { enableGesture } from "../Gesture/gesture.js";

export { STATE, ATTRIBUTE } from "./framework.js";

export class List extends Component {
  constructor() {
    super();
  }

  appendChild(child) {
    this.template = child;

    this.render();
  }

  render() {
    this.children = this[ATTRIBUTE].data.map(this.template);

    this.root = (<div>{this.children}</div>).render();

    return this.root;
  }
}
