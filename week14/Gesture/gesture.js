const element = document.documentElement;

let isListeningMouse = false;

element.addEventListener("mousedown", (event) => {
  const context = Object.create(null);

  contexts.set("mouse" + (1 << event.button), context);

  start(event, context);

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
        move(event, context);
      }

      button = button << 1;
    }
  };

  const mouseup = (event) => {
    const context = contexts.get("mouse" + (1 << event.button));
    end(event, context);

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

const contexts = new Map();

element.addEventListener("touchstart", (event) => {
  for (const touch of event.changedTouches) {
    const context = Object.create(null);

    contexts.set(touch.identifier, context);

    start(touch, context);
  }
});

element.addEventListener("touchmove", (event) => {
  for (const touch of event.changedTouches) {
    move(touch, contexts.get(touch.identifier));
  }
});

element.addEventListener("touchend", (event) => {
  for (const touch of event.changedTouches) {
    end(touch, contexts.get(touch.identifier));

    contexts.delete(touch.identifier);
  }
});

element.addEventListener("touchcancel", (event) => {
  for (const touch of event.changedTouches) {
    cancel(touch, contexts.get(touch.identifier));

    contexts.delete(touch.identifier);
  }
});

// let handler;
// let startX, startY;
// let isPan = false,
//   isTap = true,
//   isPress = false;

const start = (point, context) => {
  console.log(context, "---context");
  (context.startX = point.clientX), (context.startY = point.clientY);

  context.isTap = true;
  context.isPan = false;
  context.isPress = false;

  context.handler = setTimeout(() => {
    context.isTap = false;
    context.isPan = false;
    context.isPress = true;

    context.handler = null;

    console.log("press");
  }, 500);

  // console.log(
  //   point.clientX,
  //   point.clientY,
  //   "start---point.clientX, point.clientY"
  // );
};

const move = (point, context) => {
  let dx = point.clientX - context.startX,
    dy = point.clientY - context.startY;

  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isTap = false;
    context.isPan = true;
    context.isPress = false;

    console.log("panstart");
    clearTimeout(context.handler);
  }

  if (context.isPan) {
    console.log(dx, dy, "---dx, dy");
    console.log("pan");
  }

  // console.log(
  //   point.clientX,
  //   point.clientY,
  //   "move---point.clientX, point.clientY"
  // );
};

const end = (point, context) => {
  // console.log(
  //   point.clientX,
  //   point.clientY,
  //   "end---point.clientX, point.clientY"
  // );

  if (context.isTap) {
    console.log("tap");
    dispatch("tap", {});
    clearTimeout(context.handler);
  }

  if (context.isPan) {
    console.log("panend");
  }

  // console.log(isPress, "---isPress");

  if (context.isPress) {
    console.log("pressend");
  }
};

const cancel = (point, context) => {
  clearTimeout(context.handler);
  console.log(
    point.clientX,
    point.clientY,
    "cancel---point.clientX, point.clientY"
  );
};

function dispatch(type, properties) {
  const event = new Event(type);

  for (const name in properties) {
    event[name] = properties[name];
  }

  element.dispatchEvent(event);

  console.log(event, "---event");
}
