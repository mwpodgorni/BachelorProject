import level from "@/assets/games/12-snake/level.png";
export default class Start extends Phaser.Scene {
  gameOptions = {
    columns: 2,
    rows: 2,
  };
  text;
  enter;
  levelGroup;

  style = {
    fontSize: "40px",
    color: "#ffffff",
    letterSpacing: 400,
    fontFamily: "Impact",
  };

  constructor() {
    super({ key: "Start" });
  }
  preload() {
    this.load.image("level", level);
  }
  create() {
    const welcomeTextPositionX = this.cameras.main.centerX;
    const welcomeTextPositionY = this.cameras.main.centerY / 4;
    console.log(welcomeTextPositionX / 19);
    this.style.fontSize = Math.round(welcomeTextPositionX / 10) + "px";
    this.text = this.add
      .text(
        welcomeTextPositionX,
        welcomeTextPositionY,
        "C h o o s e   m a p   t o   s t a r t",
        this.style
      )
      .setOrigin(0.5);

    this.levelGroup = this.add.group();

    // var thumb = this.add.image(150, 200, "level");
    // thumb.levelNumber = 1;
    // var levelText = this.add.text(
    //   thumb.x,
    //   thumb.y,
    //   thumb.levelNumber,
    //   this.style
    // );
    // levelText.setOrigin(0.5);
    // this.levelGroup.add(thumb);
    // this.levelGroup.add(levelText);

    const posX = this.cameras.main.centerX - 85;
    const posY = this.cameras.main.centerY - 100;
    for (var j = 0; j < this.gameOptions.rows; j++) {
      for (var i = 0; i < this.gameOptions.columns; i++) {
        var thumb = this.add.image(posX + i * 170, posY + j * 170, "level");
        thumb.levelNumber = 1 + j * this.gameOptions.columns + i;
        +j * 100, "level";
        var levelText = this.add.text(
          thumb.x,
          thumb.y,
          thumb.levelNumber,
          this.style
        );
        levelText.setOrigin(0.5);
        this.levelGroup.add(thumb);
        this.levelGroup.add(levelText);
      }
    }

    // this.enter = this.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.ENTER
    // );
    // this.input.on("pointerdown", this.start, this);

    this.input.on(
      "pointerdown",
      function (pointer) {
        this.levelGroup.children.iterate(function (item) {
          //if for locked levels
          // if (item.texture.key == "levelthumb") {
          var boundingBox = item.getBounds();
          if (
            Phaser.Geom.Rectangle.Contains(boundingBox, pointer.x, pointer.y)
          ) {
            switch (item.levelNumber) {
              case 1:
                this.scene.start("One");
                break;
              case 2:
                this.scene.start("Two");
                break;
              case 3:
                this.scene.start("Three");
                break;
              case 4:
                this.scene.start("Four");
                break;
            }
          }
        }, this);
      },
      this
    );
  }
  update() {
    // if (this.enter.isDown) {
    //   this.scene.start("Main");
    // }
  }
}
