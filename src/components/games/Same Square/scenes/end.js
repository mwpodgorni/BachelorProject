class End extends Phaser.Scene {
  text;
  enter;
  style = {
    fontSize: "40px"
  };
  constructor() {
    super({ key: "End" });
  }
  preload() {}
  create() {
    this.text = this.add.text(
      300,
      520,
      "Game is over. Click enter to go back to start screen.",
      this.style
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
