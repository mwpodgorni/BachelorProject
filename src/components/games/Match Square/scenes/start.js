import { Scene } from "phaser";
export default class Start extends Scene {
  text;
  style = {
    fontSize: "40px",
    color: "#ffffff",
    letterSpacing: 400,
    fontFamily: "Impact",
  };
  constructor() {
    super({ key: "Start" });
  }

  preload() {}

  create() {
    const welcomeTextPositionX = this.cameras.main.centerX;
    const welcomeTextPositionY = this.cameras.main.centerY;
    this.style.fontSize = Math.round(welcomeTextPositionX / 6) + "px";
    this.text = this.add
      .text(
        welcomeTextPositionX,
        welcomeTextPositionY,
        "C l i c k   t o   s t a r t",
        this.style
      )
      .setOrigin(0.5);
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
}
