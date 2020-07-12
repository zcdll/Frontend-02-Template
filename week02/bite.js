class Human {
  constructor(blood) {
    this.blood = blood;
  }

  hurt(damage) {
    switch (damage) {
      case "bog bite":
        this.blood -= 50;
        break;
      case "mosquito 比特":
        this.blood -= 10;
        break;
      default:
        this.blood -= 2;
        break;
    }
  }
}

const human = new Human(100);

human.hurt("dog bite");

console.log(human.blood, "---human.blood");
