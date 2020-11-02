import platform from "@/assets/games/8-bouncing_square/platform.png";
import square from "@/assets/games/8-bouncing_square/square.png";
class Main extends Phaser.Scene {
  saveData;
  degree = 90;
  style2 = {
    color: "#000000",
    fontFamily: "Impact",
  };
  gameOptions = {
    bounceHeight: 250,
    squareGravity: 1400,
    squarePower: 800,
    squarePosition: 0.4,
    platformSpeed: 250,
    platformDistanceRange: [100, 300],
    platformHeightRange: [-50, 100],
    platformLengthRange: [30, 150],
    localStorageName: "bouncingSquareScore",
  };
  square;
  style = {
    fontSize: "30px",
  };
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("square", square);
    this.load.image("ground", platform);
  }
  create() {
    this.platformGroup = this.physics.add.group();
    this.firstBounce = 0;
    this.gameStart = false;
    this.square = this.physics.add.sprite(
      this.game.config.width * this.gameOptions.squarePosition,
      (this.game.config.height / 4) * 3 - this.gameOptions.bounceHeight,
      "square"
    );
    this.square.body.gravity.y = this.gameOptions.squareGravity;
    this.square.setBounce(1);
    this.square.body.checkCollision.down = true;
    this.square.body.checkCollision.up = false;
    this.square.body.checkCollision.left = false;
    this.square.body.checkCollision.right = false;
    this.square.setSize(50, 50, true);

    let platformX = this.square.x;
    for (let i = 0; i < 12; i++) {
      let platform = this.platformGroup.create(
        platformX,
        (this.game.config.height / 4) * 3 +
          Phaser.Math.Between(
            this.gameOptions.platformHeightRange[0],
            this.gameOptions.platformHeightRange[1]
          ),
        "ground"
      );
      platform.setOrigin(0.5, 1);
      platform.setImmovable(true);
      platform.displayWidth = Phaser.Math.Between(
        this.gameOptions.platformLengthRange[0],
        this.gameOptions.platformLengthRange[1]
      );
      platformX += Phaser.Math.Between(
        this.gameOptions.platformDistanceRange[0],
        this.gameOptions.platformDistanceRange[1]
      );
    }
    this.input.on("pointerdown", this.boost, this);
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
    this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
  }
  boost() {
    if (this.firstBounce != 0) {
      this.gameStart = true;
      this.square.body.velocity.y = this.gameOptions.squarePower;
    }
  }
  getRightmostPlatform() {
    let rightmostPlatform = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      rightmostPlatform = Math.max(rightmostPlatform, platform.x);
    });
    return rightmostPlatform;
  }
  update() {
    this.physics.world.collide(
      this.platformGroup,
      this.square,
      function () {
        if (this.firstBounce == 0) {
          this.firstBounce = this.square.body.velocity.y;
          if (this.square.angle % 90 == 0) {
            this.degree = 0;
          }
        } else {
          this.square.body.velocity.y = this.firstBounce;
          if (this.square.angle % 90 == 0) {
            this.degree = 0;
          }
          if (this.gameStart) {
            this.platformGroup.setVelocityX(-this.gameOptions.platformSpeed);
          }
        }
      },
      null,
      this
    );
    if (this.degree != 90) {
      this.square.angle += 5;
      this.degree += 5;
    }
    this.platformGroup.getChildren().forEach(function (platform) {
      if (platform.getBounds().right < 0) {
        this.updateScore(1);
        platform.x =
          this.getRightmostPlatform() +
          Phaser.Math.Between(
            this.gameOptions.platformDistanceRange[0],
            this.gameOptions.platformDistanceRange[1]
          );
        platform.displayWidth = Phaser.Math.Between(
          this.gameOptions.platformLengthRange[0],
          this.gameOptions.platformLengthRange[1]
        );
      }
    }, this);
    if (this.square.y > this.game.config.height) {
      localStorage.setItem(
        this.gameOptions.localStorageName,
        Math.max(this.score, this.topScore) + ""
      );
      this.scene.start("End");
    }
  }
}

export default Main;
