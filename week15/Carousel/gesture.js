export class Listener {
  constructor(element, recognizer) {
    let isListeningMouse = false;
    let contexts = new Map();
    element.addEventListener("mousedown", (event) => {
      let context = Object.create(null);
      contexts.set("mouse" + event.button, context);
      recognizer.start(event, context);

      let mousemove = (event) => {
        let context;
        if (event.buttons == 1) {
          context = contexts.get("mouse" + 0);
          recognizer.move(event, context);
        } else if (event.buttons == 2) {
          context = contexts.get("mouse" + 2);
          recognizer.move(event, context);
        } else if (event.buttons == 4) {
          context = contexts.get("mouse" + 1);
          recognizer.move(event, context);
        } else if (event.buttons == 3) {
          context = contexts.get("mouse" + 0);
          recognizer.move(event, context);
          context = contexts.get("mouse" + 2);
          recognizer.move(event, context);
        } else if (event.buttons == 5) {
          context = contexts.get("mouse" + 0);
          recognizer.move(event, context);
          context = contexts.get("mouse" + 1);
          recognizer.move(event, context);
        } else if (event.buttons == 6) {
          context = contexts.get("mouse" + 2);
          recognizer.move(event, context);
          context = contexts.get("mouse" + 1);
          recognizer.move(event, context);
        } else if (event.buttons == 7) {
          context = contexts.get("mouse" + 0);
          recognizer.move(event, context);
          context = contexts.get("mouse" + 2);
          recognizer.move(event, context);
          context = contexts.get("mouse" + 1);
          recognizer.move(event, context);
        }
      };

      let mouseup = (event) => {
        let context = contexts.get("mouse" + event.button);
        recognizer.end(event, context);
        contexts.delete("mouse" + event.button);

        if (event.buttons === 0) {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup);
          isListeningMouse = false;
        }
      };

      if (!isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        isListeningMouse = true;
      }
    });

    element.addEventListener("touchstart", (event) => {
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });
    element.addEventListener("touchmove", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });
    element.addEventListener("touchend", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });
    // 系统事件会打断touch，比如说alert，这时候就会触发cancel事件
    element.addEventListener("touchcancel", (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start(point, context) {
    context.startX = point.clientX;
    context.startY = point.clientY;

    this.dispatcher.dispatch("start", {
      clientX: point.clientX,
      clientY: point.clientY,
    });

    context.points = [
      {
        t: Date.now(),
        x: point.clientY,
        y: point.clientY,
      },
    ];

    context.isPan = false;
    context.isTap = true;
    context.isPress = false;
    context.handler = setTimeout(() => {
      context.isPan = false;
      context.isTap = false;
      context.isPress = true;
      context.handle = null;
      this.dispatcher.dispatch("press", {});
    }, 500);
  }

  move(point, context) {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true;
      context.isTap = false;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch("pressStart", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
      clearTimeout(context.handler);
    }

    if (context.isPan) {
      this.dispatcher.dispatch("pan", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }

    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    );
    context.points.push({
      t: Date.now(),
      x: point.clientY,
      y: point.clientY,
    });
  }

  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch("tap", {});
      clearTimeout(context.handler);
    }

    if (context.isPress) {
      this.dispatcher.dispatch("pressend", {});
    }
    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    );
    let d, v;
    if (!context.points.length) {
      v = 0;
    } else {
      d = Math.sqrt(
        (point.clientX - context.points[0].x) ** 2 +
          (point.clientY - context.points[0].y)
      );
      v = d / (Date.now() - context.points[0].t);
    }
    if (v > 1.5) {
      context.isFlick = true;
      this.dispatcher.dispatch("flick", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch("panend", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
    }

    this.dispatcher.dispatch("end", {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
      velocity: v,
    });
  }

  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch("cancel", {});
  }
}

export class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}
