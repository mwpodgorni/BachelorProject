import { Scene } from "phaser";
export default class Start extends Scene {
  text;
  enter;
  style = {
    fontSize: "20px"
  };
  constructor() {
    super({ key: "Start" });
  }

  preload() {}

  create() {
    this.text = this.add.text(40, 230, "Click enter to start", this.style);
    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.input.on("pointerdown", this.start, this);
  }
  update() {
    if (this.enter.isDown) {
      this.scene.start("Main");
    }
  }
  start() {
    this.scene.start("Main");
  }
  resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = this.game.config.width / this.game.config.height;
    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = windowWidth / gameRatio + "px";
    } else {
      canvas.style.width = windowHeight * gameRatio + "px";
      canvas.style.height = windowHeight + "px";
    }
  }
}
