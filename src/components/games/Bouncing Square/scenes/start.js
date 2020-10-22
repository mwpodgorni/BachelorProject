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
    this.text = this.add.text(40, 250, "Click enter to start", this.style);
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
