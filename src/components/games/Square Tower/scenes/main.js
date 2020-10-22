import ground from "@/assets/games/3-square_tower/ground.png";
import crate from "@/assets/games/3-square_tower/crate.png";
class Main extends Phaser.Scene {
  gameOptions = {
    gravity: 1,
    crateHeight: 300,
    crateRange: [-300, 300],
    crateSpeed: 1200,
    localStorageName: "squaretower"
  };
  canDrop;
  scoreText;
  savedData;
  score;
  bestScoreText;
  crateGroup;
  style = {
    fontSize: "30px"
  };
  ground;
  movingCrate;
  actionCamera;
  removeEvent;
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("ground", ground);
    this.load.image("crate", crate);
  }
  create() {
    this.matter.world.update30Hz();
    this.canDrop = true;
    this.score = 0;
    this.addGround();
    this.addMovingCrate();
    this.scoreText = this.add.text(10, 10, "", this.style);
    this.crateGroup = this.add.group();
    this.matter.world.on("collisionstart", this.checkCollision, this);
    this.savedData =
      localStorage.getItem(this.gameOptions.localStorageName) == null
        ? {
            score: 0
          }
        : JSON.parse(localStorage.getItem(this.gameOptions.localStorageName));
    this.bestScoreText = this.add.text(
      10,
      50,
      "Best score: " + this.savedData.score.toString(),
      this.style
    );
    this.setCameras();
    this.updateScore();

    this.input.on("pointerdown", this.dropCrate, this);
  }
  update() {
    this.crateGroup.getChildren().forEach(function(crate) {
      if (crate.y > this.game.config.height + crate.displayHeight) {
        if (!crate.body.hit) {
          this.nextCrate();
        }
        crate.destroy();
        let bestScore = Math.max(this.score, this.savedData.score);
        localStorage.setItem(
          this.gameOptions.localStorageName,
          JSON.stringify({
            score: bestScore
          })
        );
        this.scene.start("End");
      }
    }, this);
  }
  updateScore() {
    this.scoreText.text = "Score: " + this.score.toString();
  }
  addGround() {
    this.ground = this.matter.add.sprite(
      this.game.config.width / 2,
      this.game.config.height,
      "ground"
    );
    this.ground.setBody({
      type: "rectangle",
      width: this.ground.displayWidth,
      height: this.ground.displayHeight * 2
    });
    this.ground.setOrigin(0.5, 1);
    this.ground.setStatic(true);
  }
  addMovingCrate() {
    this.movingCrate = this.add.sprite(
      this.game.config.width / 2 - this.gameOptions.crateRange[0],
      this.ground.getBounds().top - this.gameOptions.crateHeight,
      "crate"
    );
    this.tweens.add({
      targets: this.movingCrate,
      x: this.game.config.width / 2 - this.gameOptions.crateRange[1],
      duration: this.gameOptions.crateSpeed,
      yoyo: true,
      repeat: -1
    });
  }
  checkCollision(e, b1, b2) {
    if (b1.isCrate && !b1.hit) {
      b1.hit = true;
      this.nextCrate();
      this.score += 10;
    }
    if (b2.isCrate && !b2.hit) {
      b2.hit = true;
      this.nextCrate();
    }
  }
  setCameras() {
    this.actionCamera = this.cameras.add(
      0,
      0,
      this.game.config.width,
      this.game.config.height
    );
    this.actionCamera.ignore(this.scoreText);
    this.actionCamera.ignore(this.bestScoreText);
    this.cameras.main.ignore([this.ground, this.movingCrate]);
  }
  dropCrate() {
    if (this.canDrop) {
      this.canDrop = false;
      this.movingCrate.visible = false;
      this.addFallingCrate();
    }
  }

  addFallingCrate() {
    this.score += 10;
    this.updateScore();
    let fallingCrate = this.matter.add.sprite(
      this.movingCrate.x,
      this.movingCrate.y,
      "crate"
    );
    fallingCrate.body.isCrate = true;
    fallingCrate.body.hit = false;
    this.crateGroup.add(fallingCrate);
    this.cameras.main.ignore(fallingCrate);
  }
  nextCrate() {
    this.zoomCamera();
    this.canDrop = true;
    this.movingCrate.visible = true;
  }
  zoomCamera() {
    let maxHeight = 0;
    this.crateGroup.getChildren().forEach(function(crate) {
      if (crate.body.hit) {
        maxHeight = Math.max(
          maxHeight,
          Math.round(
            (this.ground.getBounds().top - crate.getBounds().top) /
              crate.displayWidth
          )
        );
      }
    }, this);

    this.movingCrate.y =
      this.ground.getBounds().top -
      maxHeight * this.movingCrate.displayWidth -
      this.gameOptions.crateHeight;

    let zoomFactor =
      (100 + this.gameOptions.crateHeight) /
      (this.ground.getBounds().top - this.movingCrate.y);
    // console.log("ground get bounds top:", this.ground.getBounds().top);
    // console.log("moving crate y: ", this.movingCrate.y);
    this.actionCamera.zoomTo(1, 500);
    // console.log("zoom factor: ", zoomFactor);
    let newHeight = this.game.config.height / zoomFactor;
    // console.log("new height: ", newHeight);
    // console.log("---------");
    this.actionCamera.pan(
      this.game.config.width / 2,
      this.game.config.height / 2 - (newHeight - this.game.config.height) / 4,
      500
    );
  }
}

export default Main;
