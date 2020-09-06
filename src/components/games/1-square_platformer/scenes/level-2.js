import navigation from "@/assets/games/1-square_platformer/navigation.png";

class LevelTwo extends Phaser.Scene {
  constructor() {
    super({ key: "LevelTwo" });
  }
  preload() {
    this.load.image("navigation", navigation);
  }
  create() {
    this.score = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.physics.add.image(30, 90, "player");
    this.level = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.exit = this.physics.add.staticImage(570, 450, "exit");
    this.lava = this.physics.add.staticGroup();
    this.player.setBounce(0.1);
    this.buildLevel();
    this.add.image(300, 530, "navigation");
    this.pointer = this.input.activePointer;

    this.physics.add.collider(this.player, this.level);
    this.physics.add.collider(this.coins, this.level);
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.lava,
      this.touchLava,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.exit,
      this.nextLevel,
      null,
      this
    );
  }
  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-150);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(150);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-290);
    }
    if (this.pointer.isDown) {
      if (
        this.pointer.x > 140 &&
        this.pointer.x < 240 &&
        this.pointer.y > 480
      ) {
        this.player.setVelocityX(-150);
      } else if (
        this.pointer.x > 250 &&
        this.pointer.x < 350 &&
        this.pointer.y > 480 &&
        this.player.body.touching.down
      ) {
        this.player.setVelocityY(-300);
      } else if (
        this.pointer.x > 360 &&
        this.pointer.x < 460 &&
        this.pointer.y > 480
      ) {
        this.player.setVelocityX(150);
      }
    }
  }
  buildLevel() {
    let levelArchitecture = [
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "x        x                   x",
      "x        x                   x",
      "x        x       o           x",
      "x        x       xx~~~xx     x",
      "xxx      x          x        x",
      "x        x          x        x",
      "x       ox          x        x",
      "x      xxx          x  xxxxxxx",
      "x        xxx        x   o    x",
      "x        x          xxxxxxx  x",
      "x        x          x        x",
      "x       ox          x        x",
      "x      xxx          x        x",
      "x        xxx~~      x        x",
      "x        x          x        x",
      "x        x          x    x   x",
      "x        x          x    x   x",
      "x      xxx      xx~~xx   x   x",
      "x                   x    x   x",
      "x                   x    x   x",
      "x                   x    x   x",
      "x                   x  o x   x",
      "x~~~~~~~xxxxxxxxxxxxxxxxxxxxxx"
    ];
    for (var i = 0; i < levelArchitecture.length; i++) {
      for (var j = 0; j < levelArchitecture[i].length; j++) {
        if (levelArchitecture[i][j] == "x") {
          this.level.create(10 + 20 * j, 10 + 20 * i, "wall");
        } else if (levelArchitecture[i][j] == "~") {
          this.lava.create(10 + 20 * j, 10 + 20 * i, "lava");
        } else if (levelArchitecture[i][j] == "o") {
          this.coins.add(this.add.image(10 + 20 * j, 10 + 20 * i, "coin"));
        } else if (levelArchitecture[i][j] == "p") {
        }
      }
    }
  }
  collectCoin(player, coin) {
    coin.body.enable = false;
    coin.visible = false;
    this.score++;
  }
  touchLava() {
    this.scene.start("LevelTwo");
  }
  nextLevel() {
    if (this.score == 5) {
      this.scene.start("LevelThree");
    }
  }
}
export default LevelTwo;
