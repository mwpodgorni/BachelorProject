import { Scene } from "phaser";
export default class Start extends Scene {
  text;
  enter;

  constructor() {
    super({ key: "Start" });
  }

  preload() {}

  create() {
    this.text = this.add.text(195, 233, "Click enter to start");
    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.input.on("pointerdown", this.start, this);
  }
  update() {
    if (this.enter.isDown) {
      this.scene.start("LevelOne");
    }
  }
  start() {
    this.scene.start("LevelOne");
  }
}
