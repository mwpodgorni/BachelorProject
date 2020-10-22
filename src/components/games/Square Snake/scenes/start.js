import { Scene } from "phaser";
import level from "@/assets/games/12-square_snake/level.png";
export default class Start extends Scene {
  gameOptions = {
    columns: 3,
    rows: 4
  };
  text;
  enter;
  levelGroup;
  style = {
    fontSize: "30px",
    color: "#ffffff",
    letterSpacing: 100,
    fontFamily: "Impact"
  };
  constructor() {
    super({ key: "Start" });
  }

  preload() {
    this.load.image("level", level);
  }

  create() {
    this.text = this.add.text(
      320,
      60,
      "C h o o s e   l e v e l   t o   s t a r t",
      this.style
    );
    this.text.setOrigin(0.5);
    this.levelGroup = this.add.group();

    var thumb = this.add.image(150, 200, "level");
    thumb.levelNumber = 1;
    var levelText = this.add.text(
      thumb.x,
      thumb.y,
      thumb.levelNumber,
      this.style
    );
    levelText.setOrigin(0.5);
    this.levelGroup.add(thumb);
    this.levelGroup.add(levelText);

    // for (var j = 0; j < this.gameOptions.rows; j++) {
    //   for (var i = 0; i < this.gameOptions.columns; i++) {
    //     var thumb = this.add.image(150 + i * 170, 200 + j * 180, "level");
    //     thumb.levelNumber = 1 + j * this.gameOptions.columns + i;
    //     +j * 100, "level";
    //     var levelText = this.add.text(
    //       thumb.x,
    //       thumb.y,
    //       thumb.levelNumber,
    //       this.style
    //     );
    //     levelText.setOrigin(0.5);
    //     this.levelGroup.add(thumb);
    //     this.levelGroup.add(levelText);
    //   }
    // }

    this.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    // this.input.on("pointerdown", this.start, this);

    this.input.on(
      "pointerdown",
      function(pointer) {
        this.levelGroup.children.iterate(function(item) {
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
              case 5:
                this.scene.start("Five");
                break;
              case 6:
                this.scene.start("Six");
                break;
              case 7:
                this.scene.start("Seven");
                break;
              case 8:
                this.scene.start("Eight");
                break;
              case 9:
                this.scene.start("Nine");
                break;
              case 10:
                this.scene.start("Ten");
                break;
              case 11:
                this.scene.start("Eleven");
                break;
              case 12:
                this.scene.start("Twelve");
                break;
            }
            // console.log(item.levelNumber);
            // this.scene.start("PlayLevel", {
            //     level: item.levelNumber,
            //     stars: this.stars
            // });
          }
          // }
        }, this);
      },
      this
    );
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
