import ground from "@/assets/games/8-bouncing_square/ground.png";
import ball from "@/assets/games/8-bouncing_square/ball.png";
class Main extends Phaser.Scene {
  saveData;
  gameOptions = {
    bounceHeight: 300,
    ballGravity: 1200,
    ballPower: 1200,
    ballPosition: 0.2,
    platformSpeed: 250,
    platformDistanceRange: [150, 250],
    platformHeightRange: [-50, 50],
    platformLengthRange: [40, 60],
    localStorageName: "bouncingsquare"
  };

  style = {
    fontSize: "30px"
  };
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("ball", ball);
    this.load.image("ground", ground);
  }
  create() {
    this.platformGroup = this.physics.add.group();
    this.firstBounce = 0;
    this.gameStart = false;
    this.ball = this.physics.add.sprite(
      this.game.config.width * this.gameOptions.ballPosition,
      (this.game.config.height / 4) * 3 - this.gameOptions.bounceHeight,
      "ball"
    );
    this.ball.body.gravity.y = this.gameOptions.ballGravity;
    this.ball.setBounce(1);
    this.ball.body.checkCollision.down = true;
    this.ball.body.checkCollision.up = false;
    this.ball.body.checkCollision.left = false;
    this.ball.body.checkCollision.right = false;
    this.ball.setSize(30, 50, true);

    let platformX = this.ball.x;
    for (let i = 0; i < 10; i++) {
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
    this.scoreText = this.add.text(10, 10, "");
    this.updateScore(this.score);
  }

  updateScore(inc) {
    this.score += inc;
    this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
  }
  boost() {
    if (this.firstBounce != 0) {
      this.gameStart = true;
      this.ball.body.velocity.y = this.gameOptions.ballPower;
    }
  }
  getRightmostPlatform() {
    let rightmostPlatform = 0;
    this.platformGroup.getChildren().forEach(function(platform) {
      rightmostPlatform = Math.max(rightmostPlatform, platform.x);
    });
    return rightmostPlatform;
  }
  update() {
    this.physics.world.collide(
      this.platformGroup,
      this.ball,
      function() {
        if (this.firstBounce == 0) {
          this.firstBounce = this.ball.body.velocity.y;
        } else {
          this.ball.body.velocity.y = this.firstBounce;
          if (this.gameStart) {
            this.platformGroup.setVelocityX(-this.gameOptions.platformSpeed);
          }
        }
      },
      null,
      this
    );
    this.platformGroup.getChildren().forEach(function(platform) {
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
    if (this.ball.y > this.game.config.height) {
      localStorage.setItem(
        this.gameOptions.localStorageName,
        Math.max(this.score, this.topScore) + ""
      );
      this.scene.start("End");
    }
  }
}

export default Main;
