// const element = document.documentElement;

export class Dispatcher {
  constructor(element) {
    this.element = element;
  }

  dispatch(type, properties) {
    const event = new Event(type);

    for (const name in properties) {
      event[name] = properties[name];
    }

    this.element.dispatchEvent(event);
  }
}

export class Listener {
  constructor(element, recognizer) {
    let isListeningMouse = false;

    const contexts = new Map();

    // 鼠标事件
    element.addEventListener("mousedown", (event) => {
      const context = Object.create(null);

      contexts.set("mouse" + (1 << event.button), context);

      recognizer.start(event, context);

      const mousemove = (event) => {
        console.log(event.buttons, "---event.buttons");

        let button = 1;

        while (button <= event.buttons) {
          contexts.get("mouse");
          if (button & event.buttons) {
            // order of buttons & button property is not same
            let key;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            } else {
              key = button;
            }
            const context = contexts.get("mouse" + key);
            recognizer.move(event, context);
          }

          button = button << 1;
        }
      };

      const mouseup = (event) => {
        const context = contexts.get("mouse" + (1 << event.button));
        recognizer.end(event, context);

        contexts.delete("mouse" + (1 << event.button));

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

    // 触摸事件
    element.addEventListener("touchstart", (event) => {
      for (const touch of event.changedTouches) {
        const context = Object.create(null);

        contexts.set(touch.identifier, context);

        recognizer.start(touch, context);
      }
    });

    element.addEventListener("touchmove", (event) => {
      for (const touch of event.changedTouches) {
        recognizer.move(touch, contexts.get(touch.identifier));
      }
    });

    element.addEventListener("touchend", (event) => {
      for (const touch of event.changedTouches) {
        recognizer.end(touch, contexts.get(touch.identifier));

        contexts.delete(touch.identifier);
      }
    });

    element.addEventListener("touchcancel", (event) => {
      for (const touch of event.changedTouches) {
        recognizer.cancel(touch, contexts.get(touch.identifier));

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
    (context.startX = point.clientX), (context.startY = point.clientY);

    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ];

    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;

      context.handler = null;

      this.dispatcher.dispatch("press", {});
    }, 500);
  }

  move(point, context) {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;

    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);

      this.dispatcher.dispatch("panstart", {
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
        isVertical: Math.abs(dx) < Math.abs(dy),
      });
    }

    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    );

    context.points.push([
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ]);
  }

  end(point, context) {
    if (context.isTap) {
      console.log("tap");
      this.dispatcher.dispatch("tap", {});
      clearTimeout(context.handler);
    }

    if (context.isPress) {
      this.dispatcher.dispatch("pressend", {});
    }

    context.points = context.points.filter(
      (point) => Date.now() - point.t < 500
    );

    // v 像素每毫秒
    let d, v;

    if (!context.points.length) {
      v = 0;
    } else {
      d = Math.sqrt(
        (point.clientX - context.points[0].x) ** 2 +
          (point.clientY - context.points[0].y) ** 2
      );
      v = d / (Date.now() - context.points[0].t);
    }

    console.log(v, "---v");

    if (v > 1.5) {
      this.dispatcher.dispatch("flick", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: Math.abs(dx) < Math.abs(dy),
        isFlick: context.isFlick,
        velocity: v,
      });

      context.isFlick = true;
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch("panend", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: Math.abs(dx) < Math.abs(dy),
        isFlick: context.isFlick,
      });
    }
  }

  cancel(point, context) {
    this.dispatcher.dispatch("cancel", {});
    clearTimeout(context.handler);
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}
