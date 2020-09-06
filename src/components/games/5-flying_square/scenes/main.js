import bird from "@/assets/games/5-flying_square/bird.png";
import pipe from "@/assets/games/5-flying_square/pipe.png";

class Main extends Phaser.Scene {
  saveData;
  gameOptions = {
    // bird gravity, will make bird fall if you dont flap
    birdGravity: 800,

    // horizontal bird speed
    birdSpeed: 125,

    // flap thrust
    birdFlapPower: 300,

    // minimum pipe height, in pixels. Affects hole position
    minPipeHeight: 50,

    // distance range from next pipe, in pixels
    pipeDistance: [220, 280],

    // hole range between pipes, in pixels
    pipeHole: [100, 130],

    // local storage object name
    localStorageName: "flyingsquare"
  };

  style = {
    fontSize: "30px"
  };
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("bird", bird);
    this.load.image("pipe", pipe);
  }
  create() {
    this.pipeGroup = this.physics.add.group();
    this.pipePool = [];
    for (let i = 0; i < 4; i++) {
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipe"));
      this.pipePool.push(this.pipeGroup.create(0, 0, "pipe"));
      this.placePipes(false);
    }
    this.pipeGroup.setVelocityX(-this.gameOptions.birdSpeed);
    this.bird = this.physics.add.sprite(
      80,
      this.game.config.height / 2,
      "bird"
    );
    this.bird.body.gravity.y = this.gameOptions.birdGravity;
    this.input.on("pointerdown", this.flap, this);
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
  placePipes(addScore) {
    let rightmost = this.getRightmostPipe();
    let pipeHoleHeight = Phaser.Math.Between(
      this.gameOptions.pipeHole[0],
      this.gameOptions.pipeHole[1]
    );
    let pipeHolePosition = Phaser.Math.Between(
      this.gameOptions.minPipeHeight + pipeHoleHeight / 2,
      this.game.config.height -
        this.gameOptions.minPipeHeight -
        pipeHoleHeight / 2
    );
    this.pipePool[0].x =
      rightmost +
      this.pipePool[0].getBounds().width +
      Phaser.Math.Between(
        this.gameOptions.pipeDistance[0],
        this.gameOptions.pipeDistance[1]
      );
    this.pipePool[0].y = pipeHolePosition - pipeHoleHeight / 2;
    this.pipePool[0].setOrigin(0, 1);
    this.pipePool[1].x = this.pipePool[0].x;
    this.pipePool[1].y = pipeHolePosition + pipeHoleHeight / 2;
    this.pipePool[1].setOrigin(0, 0);
    this.pipePool = [];
    if (addScore) {
      this.updateScore(1);
    }
  }
  flap() {
    this.bird.body.velocity.y = -this.gameOptions.birdFlapPower;
  }
  getRightmostPipe() {
    let rightmostPipe = 0;
    this.pipeGroup.getChildren().forEach(function(pipe) {
      rightmostPipe = Math.max(rightmostPipe, pipe.x);
    });
    return rightmostPipe;
  }
  update() {
    this.physics.world.collide(
      this.bird,
      this.pipeGroup,
      function() {
        this.die();
      },
      null,
      this
    );
    if (this.bird.y > this.game.config.height || this.bird.y < 0) {
      this.die();
    }
    this.pipeGroup.getChildren().forEach(function(pipe) {
      if (pipe.getBounds().right < 0) {
        this.pipePool.push(pipe);
        if (this.pipePool.length == 2) {
          this.placePipes(true);
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
  resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = this.game.config.width / this.game.config.height;
    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = windowWidth / gameRatio + "px";
    } else {
      canvas.style.width = windowHeight * gameRatio + "px";
      canvas.style.height = windowHeight + "px";
    }
  }
}

export default Main;
