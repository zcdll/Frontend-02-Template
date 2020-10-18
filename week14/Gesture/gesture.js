const element = document.documentElement;

element.addEventListener("mousedown", (event) => {
  start(event);
  const mousemove = (event) => {
    move(event);
  };

  const mouseup = (event) => {
    end(event);
    element.removeEventListener("mousemove", mousemove);
    element.removeEventListener("mouseup", mouseup);
  };

  element.addEventListener("mousemove", mousemove);
  element.addEventListener("mouseup", mouseup);
});

element.addEventListener("touchstart", (event) => {
  for (const touch of event.changedTouches) {
    start(touch);
  }
});

element.addEventListener("touchmove", (event) => {
  for (const touch of event.changedTouches) {
    move(touch);
  }
});

element.addEventListener("touchend", (event) => {
  for (const touch of event.changedTouches) {
    end(touch);
  }
});

element.addEventListener("touchcancel", (event) => {
  for (const touch of event.changedTouches) {
    cancel(touch);
  }
});

let handler;
let startX, startY;
let isPan = false,
  isTap = true;

const start = (point) => {
  (startX = point.clientX), (startY = point.clientY);

  isTap = true;
  isPan = false;
  isPress = false;

  handler = setTimeout(() => {
    isTap = false;
    isPan = false;
    isPress = true;

    handler = null;

    console.log("press");
  }, 500);

  // console.log(
  //   point.clientX,
  //   point.clientY,
  //   "start---point.clientX, point.clientY"
  // );
};

const move = (point) => {
  let dx = point.clientX - startX,
    dy = point.clientY - startY;

  if (!isPan && dx ** 2 + dy ** 2 > 100) {
    isTap = false;
    isPan = true;
    isPress = false;

    console.log("panstart");
    clearTimeout(handler);
  }

  if (isPan) {
    console.log(dx, dy, "---dx, dy");
    console.log("pan");
  }

  // console.log(
  //   point.clientX,
  //   point.clientY,
  //   "move---point.clientX, point.clientY"
  // );
};

const end = (point) => {
  // console.log(
  //   point.clientX,
  //   point.clientY,
  //   "end---point.clientX, point.clientY"
  // );

  if (isTap) {
    console.log("tap");
    clearTimeout(handler);
  }

  if (isPan) {
    console.log("panend");
  }

  console.log(isPress, "---isPress");

  if (isPress) {
    console.log("pressend");
  }
};

const cancel = (point) => {
  clearTimeout(handler);
  console.log(
    point.clientX,
    point.clientY,
    "cancel---point.clientX, point.clientY"
  );
};
