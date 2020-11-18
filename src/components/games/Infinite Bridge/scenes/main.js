import ground from "@/assets/games/15-infinite_bridge/ground.png";
import player from "@/assets/games/15-infinite_bridge/player.png";
import trap from "@/assets/games/15-infinite_bridge/trap.png";
import obstacle from "@/assets/games/15-infinite_bridge/obstacle.png";
class Main extends Phaser.Scene {
  saveData;
  style2 = { color: "#ffffff", fontFamily: "Impact" };
  gameOptions = {
    groundSize: 80,
    localStorageName: "infiniteBridgeScore",
  };
  style = { fontSize: "20px", color: "#ffffff", fontFamily: "Arial" };
  groundGroup = [];
  startingPoint;
  availableLocations = {
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  };
  tileIndex = 0;
  playerLocation = 0;
  playerGroup;
  canMove;
  canRemove;
  obstacleFrame = 0;
  obstacleStamina;
  score;
  topScore;
  scoreText;
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("ground", ground);
    this.load.spritesheet("player", player, {
      frameWidth: 70,
      frameHeight: 70,
    });

    this.load.spritesheet("trap", trap, {
      frameWidth: this.gameOptions.groundSize,
      frameHeight: this.gameOptions.groundSize,
    });
    this.load.spritesheet("obstacle", obstacle, {
      frameWidth: this.gameOptions.groundSize,
      frameHeight: this.gameOptions.groundSize,
    });
  }
  create() {
    this.getAvailableLocations();
    this.startingPoint = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height - 270,
      "ground"
    );
    this.groundGroup = this.add.group();
    this.groundGroup.add(this.startingPoint);
    this.canMove = true;
    this.canRemove = true;
    this.obstacleStamina = Phaser.Math.Between(1, 4);
    do {
      let position = this.getNextPosition();
      let nextTile = this.add.image(position.x, position.y, "ground");
      this.groundGroup.add(nextTile);
    } while (
      this.groundGroup.getLast(true).y + this.gameOptions.groundSize >
      0
    );

    this.score = 0;
    this.topScore =
      localStorage.getItem(this.gameOptions.localStorageName) == null
        ? 0
        : localStorage.getItem(this.gameOptions.localStorageName);
    this.scoreText = this.add.text(10, 10, "", this.style);
    this.updateScore(this.score);
    this.player = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height - 270,
      "player",
      0
    );
    this.anims.create({
      key: "player",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1,
    });
    this.player.play("player");
    this.input.on(
      "pointerup",
      () => {
        if (this.canMove) {
          this.movePlayer();
        }
      },
      this
    );
    this.time.addEvent({
      delay: 3000,
      callback: this.cutTile,
      callbackScope: this,
      repeat: -1,
    });
    this.time.addEvent({
      delay: 1500,
      callback: this.changeTrap,
      callbackScope: this,
      repeat: -1,
    });
  }
  update() {
    if (
      this.groundGroup.getFirst(true).y > this.cameras.main.height - 120 &&
      this.canRemove
    ) {
      this.removeTile();
    }
    if (
      !this.groundGroup.children.entries.find((element) => {
        return element.x == this.player.x && element.y == this.player.y;
      }) &&
      this.canMove
    ) {
      localStorage.setItem(
        this.gameOptions.localStorageName,
        Math.max(this.score, this.topScore)
      );
      this.scene.start("End");
    }
    if (
      this.groundGroup.children.entries.find((element) => {
        if (
          element.x == this.player.x &&
          element.y == this.player.y &&
          element.name == "trap" &&
          this.obstacleFrame == 1
        ) {
          return true;
        }
      })
    ) {
      localStorage.setItem(
        this.gameOptions.localStorageName,
        Math.max(this.score, this.topScore)
      );
      this.scene.start("End");
    }
  }
  updateScore(inc) {
    this.score += inc;
    this.scoreText.text =
      "Score: " + this.score + "\nTop Score: " + this.topScore;
  }
  cutTile() {
    if (
      this.startingPoint.x != this.player.x ||
      this.startingPoint.y != this.player.y
    ) {
      this.removeTile();
    }
  }
  changeTrap() {
    this.groundGroup.getChildren().forEach((element) => {
      if (element.name == "trap") {
        if (this.obstacleFrame == 0) {
          element.setFrame(1);
        } else {
          element.setFrame(0);
        }
      }
    });
    if (this.obstacleFrame == 0) {
      this.obstacleFrame = 1;
    } else {
      this.obstacleFrame = 0;
    }
  }
  getAvailableLocations() {
    let center = this.cameras.main.width / 2;
    this.availableLocations.first = center - this.gameOptions.groundSize * 2;
    this.availableLocations.second = center - this.gameOptions.groundSize;
    this.availableLocations.third = center;
    this.availableLocations.fourth = center + this.gameOptions.groundSize;
    this.availableLocations.fifth = center + this.gameOptions.groundSize * 2;
  }
  getNextPosition() {
    let nextPosition;
    let tileNumber;
    let canBeRight = true;
    let canBeLeft = true;
    let lastTileLocation = {
      x: this.groundGroup.getLast(true).x,
      y: this.groundGroup.getLast(true).y,
    };
    for (let i = 0; i < this.groundGroup.getLength(); i++) {
      if (
        (lastTileLocation.x - this.gameOptions.groundSize ==
          this.groundGroup.getChildren()[i].x &&
          lastTileLocation.y + this.gameOptions.groundSize ==
            this.groundGroup.getChildren()[i].y) ||
        (lastTileLocation.x - this.gameOptions.groundSize ==
          this.groundGroup.getChildren()[i].x &&
          lastTileLocation.y == this.groundGroup.getChildren()[i].y) ||
        this.groundGroup.getLength() < 2
      ) {
        canBeLeft = false;
      }
      if (
        (lastTileLocation.x + this.gameOptions.groundSize ==
          this.groundGroup.getChildren()[i].x &&
          lastTileLocation.y + this.gameOptions.groundSize ==
            this.groundGroup.getChildren()[i].y) ||
        (lastTileLocation.x + this.gameOptions.groundSize ==
          this.groundGroup.getChildren()[i].x &&
          lastTileLocation.y == this.groundGroup.getChildren()[i].y) ||
        this.groundGroup.getLength() < 2
      ) {
        canBeRight = false;
      }
    }

    if (
      lastTileLocation.x != this.availableLocations.first &&
      canBeLeft &&
      lastTileLocation.x != this.availableLocations.fifth &&
      canBeRight
    ) {
      tileNumber = Phaser.Math.Between(0, 2);
    } else if (
      lastTileLocation.x != this.availableLocations.first &&
      canBeLeft
    ) {
      tileNumber = Phaser.Math.Between(0, 1);
    } else if (
      lastTileLocation.x != this.availableLocations.fifth &&
      canBeRight
    ) {
      tileNumber = Phaser.Math.Between(1, 2);
    } else {
      tileNumber = 1;
    }
    switch (tileNumber) {
      case 0:
        nextPosition = {
          x: lastTileLocation.x - this.gameOptions.groundSize,
          y: lastTileLocation.y,
        };
        break;
      case 1:
        nextPosition = {
          x: lastTileLocation.x,
          y: lastTileLocation.y - this.gameOptions.groundSize,
        };
        break;
      case 2:
        nextPosition = {
          x: lastTileLocation.x + this.gameOptions.groundSize,
          y: lastTileLocation.y,
        };
        break;
    }
    return nextPosition;
  }
  movePlayer() {
    this.canMove = false;

    let next;
    for (let i = 0; i < this.groundGroup.getLength(); i++) {
      if (
        this.player.x == this.groundGroup.getChildren()[i].x &&
        this.player.y == this.groundGroup.getChildren()[i].y
      ) {
        next = this.groundGroup.getChildren()[i + 1];
      }
    }
    if (next.x < this.player.x) {
      if (next.name == "obstacle" && this.obstacleStamina != 0) {
        this.tweens.add({
          targets: this.player,
          x: { from: this.player.x - 20, to: this.player.x },
          ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 200,
          repeat: 0,
          yoyo: false,
          callbackScope: this,
          onComplete() {
            this.obstacleStamina--;
            if (this.obstacleStamina == 0) {
              next.setFrame(1);
            }
            this.canMove = true;
          },
        });
      } else {
        this.obstacleStamina = Phaser.Math.Between(1, 4);
        this.addTile();
        this.tweens.add({
          targets: this.player,
          x: next.x,
          duration: 100,
          callbackScope: this,
          onComplete() {
            this.updateScore(1);
            this.canMove = true;
          },
        });
      }
    } else if (next.x > this.player.x) {
      if (next.name == "obstacle" && this.obstacleStamina != 0) {
        this.tweens.add({
          targets: this.player,
          x: { from: this.player.x + 20, to: this.player.x },
          ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 200,
          repeat: 0,
          yoyo: false,
          callbackScope: this,
          onComplete() {
            this.obstacleStamina--;
            if (this.obstacleStamina == 0) {
              next.setFrame(1);
            }
            this.canMove = true;
          },
        });
      } else {
        this.obstacleStamina = Phaser.Math.Between(1, 4);
        this.addTile();
        this.tweens.add({
          targets: this.player,
          x: next.x,
          duration: 100,
          callbackScope: this,
          onComplete() {
            this.updateScore(1);
            this.canMove = true;
          },
        });
      }
    } else {
      if (next.name == "obstacle" && this.obstacleStamina != 0) {
        this.tweens.add({
          targets: this.player,
          y: { from: this.player.y - 20, to: this.player.y },
          ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 200,
          repeat: 0,
          yoyo: false,
          callbackScope: this,
          onComplete() {
            this.obstacleStamina--;
            if (this.obstacleStamina == 0) {
              next.setFrame(1);
            }
            this.canMove = true;
          },
        });
      } else {
        this.addTile();
        this.obstacleStamina = Phaser.Math.Between(1, 4);
        this.shiftTiles();
        this.updateScore(1);
      }
    }
  }
  shiftTiles() {
    this.tweens.add({
      targets: this.groundGroup.getChildren(),
      y: "+=80",
      duration: 100,
      callbackScope: this,
      onComplete() {
        this.canMove = true;
      },
    });
  }
  removeTile() {
    if (this.groundGroup.getLength() > 0) {
      this.canRemove = false;
      this.tweens.add({
        targets: this.groundGroup.getFirst(true),
        alpha: 0,
        duration: 200,
        callbackScope: this,
        onComplete() {
          this.groundGroup.remove(this.groundGroup.getFirst(true), true, true);
          this.canRemove = true;
        },
      });
    }
  }

  addTile() {
    let position = this.getNextPosition();
    let type = Phaser.Math.Between(1, 10);
    let nextTile;
    //1:obstacle, 2:trap, 3-10 ground
    if (type == 1 && this.groundGroup.getLast(true).name != "trap") {
      nextTile = this.add.sprite(position.x, position.y, "obstacle", 0);
      nextTile.setName("obstacle");
    } else if (type == 2) {
      nextTile = this.add.sprite(position.x, position.y, "trap", 0);
      nextTile.setName("trap");
    } else {
      nextTile = this.add.image(position.x, position.y, "ground");
    }
    this.groundGroup.add(nextTile);
    this.children.bringToTop(this.player);
    if (this.groundGroup.getLast(true).y + this.gameOptions.groundSize > 0) {
      this.addTile();
    }
  }
}

export default Main;
