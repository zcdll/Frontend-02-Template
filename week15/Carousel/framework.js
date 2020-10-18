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

export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");

export class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }

  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root);
  }

  triggerEvent(type, args) {
    this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, (s) => s.toUpperCase())](
      new CustomEvent(type, { detail: args })
    );
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
