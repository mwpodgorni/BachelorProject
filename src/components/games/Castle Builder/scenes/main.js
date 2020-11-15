import ground from "@/assets/games/3-castle_builder/ground.png";
import crate from "@/assets/games/3-castle_builder/square.png";
class Main extends Phaser.Scene {
  gameOptions = {
    gravity: 1,
    squareHeight: 200,
    squareRange: [-250, 250],
    squareSpeed: 1100,
    localStorageName: "squareTowerScore",
  };
  style = {
    fontSize: "20px",
    fontFamily: "Arial",
  };
  canDrop;
  squareGroup;
  base;
  movingSquare;
  secondCamera;
  score;
  bestScore;
  scoreText;
  bestScoreText;
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("base", ground);
    this.load.image("square", crate);
  }
  create() {
    this.canDrop = true;
    this.squareGroup = this.add.group();

    this.score = 0;
    this.scoreText = this.add.text(20, 15, "", this.style);
    this.bestScore =
      localStorage.getItem(this.gameOptions.localStorageName) == null
        ? 0
        : localStorage.getItem(this.gameOptions.localStorageName);
    this.bestScoreText = this.add.text(
      20,
      40,
      "Best score: " + this.bestScore,
      this.style
    );
    this.updateScore();
    this.addBase();
    this.addMovingSquare();
    this.input.on("pointerdown", this.relaseSquare, this);
    this.matter.world.on("collisionstart", this.checkCollision, this);
    this.setCameras();
  }
  update() {
    this.squareGroup.getChildren().forEach((square) => {
      if (square.y > this.cameras.main.height + square.displayHeight) {
        square.destroy();
        let bestScore = Math.max(this.score, this.bestScore);
        localStorage.setItem(this.gameOptions.localStorageName, bestScore);
        this.scene.start("End");
      }
    });
  }
  updateScore() {
    this.scoreText.text = "Score: " + this.score;
  }
  addBase() {
    this.base = this.matter.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height - 75,
      "base"
    );
    this.base.setBody({
      type: "rectangle",
      width: this.base.displayWidth,
      height: this.base.displayHeight,
    });
    this.base.setStatic(true);
  }
  addMovingSquare() {
    this.movingSquare = this.add.sprite(
      this.cameras.main.width / 2 - this.gameOptions.squareRange[0],
      this.base.getBounds().top - this.gameOptions.squareHeight,
      "square"
    );
    this.tweens.add({
      targets: this.movingSquare,
      x: this.cameras.main.width / 2 - this.gameOptions.squareRange[1],
      duration: this.gameOptions.squareSpeed,
      yoyo: true,
      repeat: -1,
    });
  }
  relaseSquare() {
    if (this.canDrop) {
      this.canDrop = false;
      this.movingSquare.visible = false;
      this.score += 1;
      this.updateScore();
      let fallingSquare = this.matter.add.sprite(
        this.movingSquare.x,
        this.movingSquare.y,
        "square"
      );
      fallingSquare.body.isSquare = true;
      fallingSquare.body.hit = false;
      this.squareGroup.add(fallingSquare);
      this.cameras.main.ignore(fallingSquare);
    }
  }
  checkCollision(event, first, second) {
    if (first.isSquare && !first.hit) {
      first.hit = true;
      this.nextSquare();
    }
    if (second.isSquare && !second.hit) {
      second.hit = true;
      this.nextSquare();
    }
  }
  nextSquare() {
    this.updateCameras();
    this.canDrop = true;
    this.movingSquare.visible = true;
  }
  setCameras() {
    this.secondCamera = this.cameras.add(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height
    );
    this.secondCamera.ignore(this.scoreText);
    this.secondCamera.ignore(this.bestScoreText);
    this.cameras.main.ignore([this.base, this.movingSquare]);
  }
  updateCameras() {
    let maxHeight = 0;
    this.squareGroup.getChildren().forEach((square) => {
      if (square.body.hit) {
        maxHeight = Math.max(
          maxHeight,
          Math.round(
            (this.base.getBounds().top - square.getBounds().top) /
              square.displayHeight
          )
        );
      }
    });
    this.movingSquare.y =
      this.base.getBounds().top -
      maxHeight * this.movingSquare.displayHeight -
      this.gameOptions.squareHeight;

    let zoomFactor =
      (100 + this.gameOptions.squareHeight) /
      (this.base.getBounds().top - this.movingSquare.y);

    let newHeight = this.cameras.main.height / zoomFactor;
    this.secondCamera.pan(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 -
        (newHeight - this.cameras.main.height) / 2.3,
      500
    );
  }
}

export default Main;
