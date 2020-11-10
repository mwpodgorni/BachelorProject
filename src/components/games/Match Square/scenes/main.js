import base from "@/assets/games/4-match_square/base.png";
import square from "@/assets/games/4-match_square/square.png";
import top from "@/assets/games/4-match_square/top.png";

const IDLE = 0;
const WAITING = 1;
const GROWING = 2;
class Main extends Phaser.Scene {
  saveData;
  gameOptions = {
    successMessages: [
      "Another One!",
      "Good Job!",
      "Nice fit!",
      "Nice!",
      "Woa!",
    ],
    bgColors: [
      0x62bd18,
      0xff5300,
      0xd21034,
      0xff475c,
      0x8f16b2,
      0x588c7e,
      0x8c4646,
    ],
    spaceWidthRange: [90, 270],
    wallRange: [20, 60],
    growTime: 1200,
    localStorageName: {
      playerScore: "perfectSquareScore",
      topScore: "perfectSquareTopScore",
    },
  };
  backgroundColor;
  style = {
    fontSize: "30px",
  };
  leftBase;
  leftTop;
  rightBase;
  rightTop;
  square;
  squareText;
  levelText;
  gameMode;
  grownTween;
  infoGroup;
  topScore;

  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("base", base);
    this.load.image("square", square);
    this.load.image("top", top);
  }
  create() {
    this.saveData =
      localStorage.getItem(this.gameOptions.localStorageName.playerScore) ==
      null
        ? {
            level: 1,
          }
        : JSON.parse(
            localStorage.getItem(this.gameOptions.localStorageName.playerScore)
          );
    this.backgroundColor = Phaser.Utils.Array.GetRandom(
      this.gameOptions.bgColors
    );
    this.cameras.main.setBackgroundColor(this.backgroundColor);

    this.leftBase = this.add.sprite(0, this.cameras.main.height, "base");
    this.leftBase.setOrigin(1, 1);
    this.rightBase = this.add.sprite(
      this.cameras.main.width,
      this.cameras.main.height,
      "base"
    );
    this.rightBase.setOrigin(0, 1);

    this.leftTop = this.add.sprite(
      0,
      this.cameras.main.height - this.leftBase.height,
      "top"
    );
    this.leftTop.setOrigin(1, 1);
    this.rightTop = this.add.sprite(
      this.cameras.main.width,
      this.cameras.main.height - this.rightBase.height,
      "top"
    );
    this.rightTop.setOrigin(0, 1);

    this.infoGroup = this.add.group();

    this.square = this.add.sprite(this.cameras.main.width / 2, -600, "square");
    this.square.successful = 0;
    this.square.setScale(0.1);
    this.squareText = this.add.text(
      this.cameras.main.width / 2,
      -600,
      (this.saveData.level - this.square.successful).toString(),
      { fontSize: "70px" }
    );
    this.squareText.setOrigin(0.5);
    this.squareText.setTint(this.backgroundColor);

    this.levelText = this.add.text(
      20,
      20,
      "Level " + this.saveData.level,
      this.style
    );
    let score =
      localStorage.getItem(this.gameOptions.localStorageName.topScore) == null
        ? 1
        : localStorage.getItem(this.gameOptions.localStorageName.topScore);
    this.topScore = this.add.text(20, 50, "Top Level: " + score, this.style);
    this.updateView();
    this.input.on("pointerdown", this.grow, this);
    this.input.on("pointerup", this.stop, this);
    this.gameMode = IDLE;
  }

  updateView() {
    let spaceWidth = Phaser.Math.Between(
      this.gameOptions.spaceWidthRange[0],
      this.gameOptions.spaceWidthRange[1]
    );
    let wallWidth = Phaser.Math.Between(
      this.gameOptions.wallRange[0],
      this.gameOptions.wallRange[1]
    );
    this.placeWall(this.leftBase, (this.cameras.main.width - spaceWidth) / 2);
    this.placeWall(this.rightBase, (this.cameras.main.width + spaceWidth) / 2);
    this.placeWall(
      this.leftTop,
      (this.cameras.main.width - spaceWidth) / 2 - wallWidth
    );
    this.placeWall(
      this.rightTop,
      (this.cameras.main.width + spaceWidth) / 2 + wallWidth
    );
    this.tweens.add({
      targets: [this.square, this.squareText],
      y: 160,
      scaleX: 0.3,
      scaleY: 0.3,
      angle: 45,
      duration: 400,
      ease: "Cubic.easeOut",
      callbackScope: this,
      onComplete: () => {
        this.rotateTween = this.tweens.add({
          targets: [this.square, this.squareText],
          angle: 44,
          duration: 300,
          yoyo: true,
          repeat: -1,
        });
        // if (this.square.successful == 0) {
        this.infoGroup.clear(true);
        let targetSquare = this.add.sprite(
          this.cameras.main.width / 2,
          this.cameras.main.height - this.leftBase.displayHeight,
          "square"
        );
        targetSquare.displayWidth = spaceWidth + wallWidth;
        targetSquare.displayHeight = spaceWidth + wallWidth;
        targetSquare.alpha = 0.2;
        targetSquare.setOrigin(0.5, 1);
        this.infoGroup.add(targetSquare);
        // }
        this.gameMode = WAITING;
      },
    });
  }
  placeWall(target, x) {
    this.tweens.add({
      targets: target,
      x: x,
      duration: 400,
      ease: "Cubic.easeOut",
    });
  }
  grow() {
    if (this.gameMode == WAITING) {
      this.gameMode = GROWING;
      if (this.square.successful == 0) {
        this.infoGroup.toggleVisible();
      }
      this.growTween = this.tweens.add({
        targets: [this.square, this.squareText],
        scaleX: 1,
        scaleY: 1,
        duration: this.gameOptions.growTime,
      });
    }
  }
  stop() {
    if (this.gameMode == GROWING) {
      this.gameMode = IDLE;
      this.growTween.stop();
      this.rotateTween.stop();
      this.rotateTween -
        this.tweens.add({
          targets: [this.square, this.squareText],
          angle: 0,
          duration: 300,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: () => {
            if (
              this.square.displayWidth <=
              this.rightBase.x - this.leftBase.x
            ) {
              this.tweens.add({
                targets: [this.square, this.squareText],
                y: this.cameras.main.height + this.square.displayWidth,
                duration: 600,
                ease: "Cubic.easeIn",
                callbackScope: this,
                onComplete: () => {
                  this.levelText.text = "Too small!";
                  this.gameOver();
                },
              });
            } else {
              if (
                this.square.displayWidth <=
                this.rightTop.x - this.leftTop.x
              ) {
                this.drop(true);
              } else {
                this.drop(false);
              }
            }
          },
        });
    }
  }
  drop(success) {
    let destY;
    let message;
    if (success) {
      destY =
        this.cameras.main.height -
        this.leftBase.displayHeight -
        this.square.displayHeight / 2;
      this.square.successful++;
      message = Phaser.Utils.Array.GetRandom(this.gameOptions.successMessages);
    } else {
      destY =
        this.game.config.height -
        this.leftBase.displayHeight -
        this.leftTop.displayHeight -
        this.square.displayHeight / 2;
      message = "Too big!";
    }
    this.tweens.add({
      targets: [this.square, this.squareText],
      y: destY,
      duration: 400,
      ease: "Bounce.easeOut",
      callbackScope: this,
      onComplete: () => {
        this.levelText.text = message;
        if (success) {
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              if (this.square.successful == this.saveData.level) {
                this.saveData.level++;
                localStorage.setItem(
                  this.gameOptions.localStorageName.playerScore,
                  JSON.stringify({
                    level: this.saveData.level,
                  })
                );
                if (
                  this.saveData.level >
                  localStorage.getItem(
                    this.gameOptions.localStorageName.topScore
                  )
                ) {
                  localStorage.setItem(
                    this.gameOptions.localStorageName.topScore,
                    this.saveData.level
                  );
                  this.topScore.text = "Top Level: " + this.saveData.level;
                }
                this.scene.start("Main");
              } else {
                this.squareText.text =
                  this.saveData.level - this.square.successful;
                this.squareText.setOrigin(0.5);
                this.levelText.text = "level " + this.saveData.level;
                this.updateView();
              }
            },
            callbackScope: this,
          });
        } else {
          this.gameOver();
        }
      },
    });
  }
  gameOver() {
    localStorage.setItem(
      this.gameOptions.localStorageName.playerScore,
      JSON.stringify({
        level: 1,
      })
    );
    this.time.addEvent({
      delay: 1000,
      callback: function () {
        this.scene.start("Main");
      },
      callbackScope: this,
    });
  }
}

export default Main;
