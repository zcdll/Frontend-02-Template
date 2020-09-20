import { Component, createElement } from "./framework.js";

// document.body.appendChild(a);

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    console.log(this.attributes.src, "---this.attributes.src");
    this.root = document.createElement("div");

    this.root.classList.add("carousel");

    for (const record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];
      let next = children[nextIndex];

      next.style.transition = "none";
      next.style.transform = `translateX(${100 - 100 * nextIndex}%)`;

      setTimeout(() => {
        next.style.transition = ""; //  置为空会让 class 中的样式生效
        current.style.transform = `translateX(${-100 - 100 * currentIndex}%)`;
        next.style.transform = `translateX(${-100 * nextIndex}%)`;

        currentIndex = nextIndex;
      }, 16);
    }, 1000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

const d = [
  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600620514228&di=5eda578b171f2e7c4067aaa2066b7571&imgtype=0&src=http%3A%2F%2Fcdnimg.kmzhijia.com%2Fzxc%2F2019%2F06%2F10%2F27.jpg",
  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600620514228&di=82baf34eb9c267ef860ff52d823b07c9&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201704%2F01%2F20170401234410_2JGWj.jpeg",
  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600620514227&di=f405112b1418a6f18b4007a922ffe846&imgtype=0&src=http%3A%2F%2Fci.xiaohongshu.com%2Fa61a1466-b0c9-4525-a539-012ff646d46c%40r_750w_750h_ss1.jpg",
  "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600620514224&di=28ee19eaa47cba826f7f24145bc2831d&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201604%2F08%2F20160408165010_iZ4Gm.jpeg",
];

let a = <Carousel src={d} />;

a.mountTo(document.body);
