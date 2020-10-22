import base from "@/assets/games/4-perfect_square/base.png";
import square from "@/assets/games/4-perfect_square/square.png";
import top from "@/assets/games/4-perfect_square/top.png";

const IDLE = 0;
const WAITING = 1;
const GROWING = 2;
class Main extends Phaser.Scene {
  saveData;
  gameOptions = {
    bgColors: [
      0x62bd18,
      0xff5300,
      0xd21034,
      0xff475c,
      0x8f16b2,
      0x588c7e,
      0x8c4646
    ],
    holeWidthRange: [80, 260],
    wallRange: [10, 50],
    growTime: 1500,
    localStorageName: "perfectsquare"
  };

  style = {
    fontSize: "30px"
  };
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
      localStorage.getItem(this.gameOptions.localStorageName) == null
        ? {
            level: 1
          }
        : JSON.parse(localStorage.getItem(this.gameOptions.localStorageName));
    let tintColor = Phaser.Utils.Array.GetRandom(this.gameOptions.bgColors);
    this.cameras.main.setBackgroundColor(tintColor);
    this.leftSquare = this.add.sprite(0, this.game.config.height, "base");
    this.leftSquare.setOrigin(1, 1);
    this.rightSquare = this.add.sprite(
      this.game.config.width,
      this.game.config.height,
      "base"
    );
    this.rightSquare.setOrigin(0, 1);
    this.leftWall = this.add.sprite(
      0,
      this.game.config.height - this.leftSquare.height,
      "top"
    );
    this.leftWall.setOrigin(1, 1);
    this.rightWall = this.add.sprite(
      this.game.config.width,
      this.game.config.height - this.rightSquare.height,
      "top"
    );
    this.rightWall.setOrigin(0, 1);
    this.square = this.add.sprite(this.game.config.width / 2, -400, "square");
    this.square.successful = 0;
    this.square.setScale(0.2);
    this.squareText = this.add.text(
      this.game.config.width / 2,
      -400,
      (this.saveData.level - this.square.successful).toString(),
      this.style
    );
    this.squareText.setOrigin(0.5);
    this.squareText.setScale(0.4);
    this.squareText.setTint(tintColor);
    this.levelText = this.add.text(
      this.game.config.width / 2,
      20,
      "level " + this.saveData.level,
      this.style
    );
    this.levelText.setOrigin(0.5, 0);
    this.updateLevel();
    this.input.on("pointerdown", this.grow, this);
    this.input.on("pointerup", this.stop, this);
    this.gameMode = IDLE;
  }
  updateLevel() {
    let holeWidth = Phaser.Math.Between(
      this.gameOptions.holeWidthRange[0],
      this.gameOptions.holeWidthRange[1]
    );
    let wallWidth = Phaser.Math.Between(
      this.gameOptions.wallRange[0],
      this.gameOptions.wallRange[1]
    );
    this.placeWall(this.leftSquare, (this.game.config.width - holeWidth) / 2);
    this.placeWall(this.rightSquare, (this.game.config.width + holeWidth) / 2);
    this.placeWall(
      this.leftWall,
      (this.game.config.width - holeWidth) / 2 - wallWidth
    );
    this.placeWall(
      this.rightWall,
      (this.game.config.width + holeWidth) / 2 + wallWidth
    );
    let squareTween = this.tweens.add({
      targets: [this.square, this.squareText],
      y: 150,
      scaleX: 0.2,
      scaleY: 0.2,
      angle: 50,
      duration: 500,
      ease: "Cubic.easeOut",
      callbackScope: this,
      onComplete: function() {
        this.rotateTween = this.tweens.add({
          targets: [this.square, this.squareText],
          angle: 40,
          duration: 300,
          yoyo: true,
          repeat: -1
        });
        if (this.square.successful == 0) {
          this.addInfo(holeWidth, wallWidth);
        }
        this.gameMode = WAITING;
      }
    });
  }
  placeWall(target, posX) {
    this.tweens.add({
      targets: target,
      x: posX,
      duration: 500,
      ease: "Cubic.easeOut"
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
        duration: this.gameOptions.growTime
      });
    }
  }
  stop() {
    if (this.gameMode == GROWING) {
      this.gameMode = IDLE;
      this.growTween.stop();
      this.rotateTween.stop();
      this.rotateTween = this.tweens.add({
        targets: [this.square, this.squareText],
        angle: 0,
        duration: 300,
        ease: "Cubic.easeOut",
        callbackScope: this,
        onComplete: function() {
          if (
            this.square.displayWidth <=
            this.rightSquare.x - this.leftSquare.x
          ) {
            this.tweens.add({
              targets: [this.square, this.squareText],
              y: this.game.config.height + this.square.displayWidth,
              duration: 600,
              ease: "Cubic.easeIn",
              callbackScope: this,
              onComplete: function() {
                this.levelText.text = "Oh no!!!";
                this.gameOver();
              }
            });
          } else {
            if (
              this.square.displayWidth <=
              this.rightWall.x - this.leftWall.x
            ) {
              this.fallAndBounce(true);
            } else {
              this.fallAndBounce(false);
            }
          }
        }
      });
    }
  }
  fallAndBounce(success) {
    let destY =
      this.game.config.height -
      this.leftSquare.displayHeight -
      this.square.displayHeight / 2;
    let message = "Yeah!!!!";
    if (success) {
      this.square.successful++;
    } else {
      destY =
        this.game.config.height -
        this.leftSquare.displayHeight -
        this.leftWall.displayHeight -
        this.square.displayHeight / 2;
      message = "Oh no!!!!";
    }
    this.tweens.add({
      targets: [this.square, this.squareText],
      y: destY,
      duration: 600,
      ease: "Bounce.easeOut",
      callbackScope: this,
      onComplete: function() {
        this.levelText.text = message;
        if (!success) {
          this.gameOver();
        } else {
          this.time.addEvent({
            delay: 1000,
            callback: function() {
              if (this.square.successful == this.saveData.level) {
                this.saveData.level++;
                localStorage.setItem(
                  this.gameOptions.localStorageName,
                  JSON.stringify({
                    level: this.saveData.level
                  })
                );
                this.scene.start("Main");
              } else {
                this.squareText.text =
                  this.saveData.level - this.square.successful;
                this.squareText.setOrigin(1, 1);
                this.levelText.text = "level " + this.saveData.level;
                this.updateLevel();
              }
            },
            callbackScope: this
          });
        }
      }
    });
  }
  addInfo(holeWidth, wallWidth) {
    this.infoGroup = this.add.group();
    let targetSquare = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height - this.leftSquare.displayHeight,
      "square"
    );
    targetSquare.displayWidth = holeWidth + wallWidth;
    targetSquare.displayHeight = holeWidth + wallWidth;
    targetSquare.alpha = 0.3;
    targetSquare.setOrigin(0.5, 1);
    this.infoGroup.add(targetSquare);
    let targetText = this.add.text(
      this.game.config.width / 2,
      targetSquare.y - targetSquare.displayHeight - 20,
      "land here",
      this.style
    );
    targetText.setOrigin(0.5, 1);
    this.infoGroup.add(targetText);
    let holdText = this.add.text(
      this.game.config.width / 2,
      250,
      "tap and hold to grow",
      this.style
    );
    holdText.setOrigin(0.5, 0);
    this.infoGroup.add(holdText);
    let releaseText = this.add.text(
      this.game.config.width / 2,
      300,
      "font",
      "release to drop",
      40
    );
    releaseText.setOrigin(0.5, 0);
    this.infoGroup.add(releaseText);
  }
  gameOver() {
    this.time.addEvent({
      delay: 1000,
      callback: function() {
        this.scene.start("Main");
      },
      callbackScope: this
    });
  }
}

export default Main;
