const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");

export class Timeline {
  constructor() {
    this[TICK] = () => {
      requestAnimationFrame(this[TICK]);
    };

    this[ANIMATIONS] = new Set();
  }

  start() {
    const startTime = Date.now();

    this[TICK] = () => {
      let t = Date.now() - startTime;

      for (const animation of this[ANIMATIONS]) {
        let t0 = t;
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t0 = animation.duration;
        }
        animation.receiveTime(t0);
      }
      requestAnimationFrame(this[TICK]);
    };

    this[TICK]();
  }

  pause() {}
  resume() {}

  reset() {}

  add(animation) {
    this[ANIMATIONS].add(animation);
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
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue;

    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}
