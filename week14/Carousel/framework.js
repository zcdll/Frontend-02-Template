export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  for (const name in attributes) {
    if (attributes.hasOwnProperty(name)) {
      element.setAttribute(name, attributes[name]);
    }
  }

  for (const child of children) {
    if (typeof child === "string") {
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }

  return element;
}

export class Component {
  constructor(type) {}

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}
