import wall from "@/assets/games/5-bat_in_cave/wall.png";
import bat from "@/assets/games/5-bat_in_cave/bat-sprite.png";

class Main extends Phaser.Scene {
  saveData;
  style2 = { color: "#ffffff", fontFamily: "Impact" };
  gameOptions = {
    batGravity: 800,
    batSpeed: 125,
    batFlapPower: 300,
    minWallHeight: 50,
    wallDistance: [220, 280],
    wallHole: [110, 140],
    localStorageName: "batInCaveScore",
  };
  bat;

  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("wall", wall);
    this.load.spritesheet("bat", bat, { frameWidth: 30, frameHeight: 30 });
  }
  create() {
    this.bat = this.physics.add.sprite(
      80,
      this.game.config.height / 2,
      "bat",
      0
    );
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNames("bat"),
      frameRate: 6,
      repeat: -1,
    });
    this.bat.play("fly");

    this.wallGroup = this.physics.add.group();
    this.wallPool = [];
    for (let i = 0; i < 8; i++) {
      this.wallPool.push(this.wallGroup.create(0, 0, "wall"));
      this.wallPool.push(this.wallGroup.create(0, 0, "wall"));
      this.placeWalls(false);
    }
    this.wallGroup.setVelocityX(-this.gameOptions.batSpeed);

    this.bat.body.gravity.y = this.gameOptions.batGravity;

    this.input.on("pointerdown", this.move, this);
    this.score = 0;
    this.topScore =
      localStorage.getItem(this.gameOptions.localStorageName) == null
        ? 0
        : localStorage.getItem(this.gameOptions.localStorageName);
    this.scoreText = this.add.text(10, 10, "", this.style2);
    this.updateScore(this.score);
  }
  updateScore(inc) {
    this.score += inc;
    this.scoreText.text =
      "Score: " + this.score + "\nTop Score: " + this.topScore;
  }
  placeWalls(addScore) {
    let rightmost = this.getRightmostWall();
    let wallHoleHeight = Phaser.Math.Between(
      this.gameOptions.wallHole[0],
      this.gameOptions.wallHole[1]
    );
    let wallHolePosition = Phaser.Math.Between(
      this.gameOptions.minWallHeight + wallHoleHeight / 2,
      this.game.config.height -
        this.gameOptions.minWallHeight -
        wallHoleHeight / 2
    );
    this.wallPool[0].x =
      rightmost +
      this.wallPool[0].getBounds().width +
      Phaser.Math.Between(
        this.gameOptions.wallDistance[0],
        this.gameOptions.wallDistance[1]
      );
    this.wallPool[0].y = wallHolePosition - wallHoleHeight / 2;
    this.wallPool[0].setOrigin(0, 1);
    this.wallPool[1].x = this.wallPool[0].x;
    this.wallPool[1].y = wallHolePosition + wallHoleHeight / 2;
    this.wallPool[1].setOrigin(0, 0);
    this.wallPool = [];
    if (addScore) {
      this.updateScore(1);
    }
  }
  move() {
    this.bat.body.velocity.y = -this.gameOptions.batFlapPower;
  }
  getRightmostWall() {
    let rightmostPipe = 0;
    this.wallGroup.getChildren().forEach(function (wall) {
      rightmostPipe = Math.max(rightmostPipe, wall.x);
    });
    return rightmostPipe;
  }
  update() {
    this.physics.world.collide(
      this.bat,
      this.wallGroup,
      function () {
        this.die();
      },
      null,
      this
    );
    if (this.bat.y > this.game.config.height || this.bat.y < 0) {
      this.die();
    }
    this.wallGroup.getChildren().forEach(function (wall) {
      if (wall.getBounds().right < 0) {
        this.wallPool.push(wall);
        if (this.wallPool.length == 2) {
          this.placeWalls(true);
        }
      }
    }, this);
  }
  die() {
    localStorage.setItem(
      this.gameOptions.localStorageName,
      Math.max(this.score, this.topScore)
    );
    this.scene.start("End");
  }
}

export default Main;
