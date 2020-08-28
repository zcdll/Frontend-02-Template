function trafficLight() {
  greenLight();
}

function greenLight() {
  console.log("************************************");
  console.log("绿灯亮");
  setTimeout(() => {
    console.log("绿灯灭");
    yellowLight();
  }, 10000);
}

function yellowLight() {
  console.log("黄灯亮");
  setTimeout(() => {
    console.log("黄灯灭");
    redLight();
  }, 2000);
}

function redLight() {
  console.log("红灯亮");
  setTimeout(() => {
    console.log("红灯灭");
    greenLight();
  }, 5000);
}

trafficLight();
