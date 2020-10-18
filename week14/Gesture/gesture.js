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

const start = (point) => {
  console.log(
    point.clientX,
    point.clientY,
    "start---point.clientX, point.clientY"
  );
};

const move = (point) => {
  console.log(
    point.clientX,
    point.clientY,
    "move---point.clientX, point.clientY"
  );
};

const end = (point) => {
  console.log(
    point.clientX,
    point.clientY,
    "end---point.clientX, point.clientY"
  );
};

const cancel = (point) => {
  console.log(
    point.clientX,
    point.clientY,
    "cancel---point.clientX, point.clientY"
  );
};
