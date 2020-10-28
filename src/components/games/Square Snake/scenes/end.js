class End extends Phaser.Scene {
  text1;
  text2;
  enter;
  style = {
    fontSize: "20px",
    color: "#ffffff",
    letterSpacing: 400,
    fontFamily: "Impact",
  };
  constructor() {
    super({ key: "End" });
  }
  preload() {}
  create() {
    const endTextPositionX = this.cameras.main.centerX;
    const endTextPositionY = this.cameras.main.centerY / 1.3;
    this.text1 = this.add
      .text(
        endTextPositionX,
        endTextPositionY,
        "T h e   g a m e   i s   o v e r",
        this.style
      )
      .setOrigin(0.5);
    this.text2 = this.add
      .text(
        endTextPositionX,
        endTextPositionY + 40,
        "C l i c k   t o   g o   b a c k   t o   s t a r t   s c r e e n",
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
      this.scene.start("Start");
    }
  }
  start() {
    this.scene.start("Start");
  }
}

export default End;
