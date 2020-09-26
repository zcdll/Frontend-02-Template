const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_TIME = Symbol("pause-time");
const PAUSE_START = Symbol("pause-start");

export class Timeline {
  constructor() {
    this[TICK] = () => {
      console.log("tick");
      requestAnimationFrame(this[TICK]);
    };

    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start() {
    const startTime = Date.now();

    this[PAUSE_TIME] = 0;

    this[TICK] = () => {
      let now = Date.now();

      for (const animation of this[ANIMATIONS]) {
        let t;

        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME];
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME];
        }

        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        animation.receiveTime(t);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };

    this[TICK]();
  }

  pause() {
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }

  resume() {
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }

  reset() {}

  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

// 属性动画，改变属性来生成动画
// 与之相对的是，帧动画，直接画好每一帧
export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    timingFunction,
    delay,
    template
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
    this.template = template;
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue;

    this.object[this.property] = this.template(
      this.startValue + (range * time) / this.duration
    );
    this.startValue + this.template((range * time) / this.duration);
  }
}
