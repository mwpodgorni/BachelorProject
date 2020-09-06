class End extends Phaser.Scene {
  text;
  enter;
  constructor() {
    super({ key: "End" });
  }
  preload() {}
  create() {
    this.text = this.add.text(
      10,
      220,
      "You finished the game. Click enter to go back to start screen."
    );
    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.input.on("pointerdown", this.start, this);
  }
  update() {
    if (this.enter.isDown) {
      this.scene.start("Start");
    }
  }
  start() {
    this.scene.start("Start");
  }
}

export default End;
