import player from "@/assets/games/1-square_platformer/player.png";
import wall from "@/assets/games/1-square_platformer/wall.png";
import lava from "@/assets/games/1-square_platformer/lava.png";
import coin from "@/assets/games/1-square_platformer/coin.png";
import exit from "@/assets/games/1-square_platformer/exit.png";
import navigation from "@/assets/games/1-square_platformer/navigation.png";

class LevelOne extends Phaser.Scene {
  player;
  level;
  wall;
  coins;
  exit;
  lava;
  score;
  cursors;

  constructor() {
    super({ key: "LevelOne" });
  }
  preload() {
    this.load.image("player", player);
    this.load.image("wall", wall);
    this.load.image("lava", lava);
    this.load.image("coin", coin);
    this.load.image("exit", exit);
    this.load.image("navigation", navigation);
  }
  create() {
    this.score = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.physics.add.image(30, 130, "player");
    this.level = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.exit = this.physics.add.staticImage(570, 450, "exit");
    this.lava = this.physics.add.staticGroup();
    this.player.setBounce(0.1);
    this.buildLevel();
    this.add.image(300, 530, "navigation");

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
    this.pointer = this.input.activePointer;
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
      this.player.setVelocityY(-260);
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
        this.player.setVelocityY(-260);
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
      "x                            x",
      "x                          o x",
      "x                     xxxxxxxx",
      "x                            x",
      "x                            x",
      "x      o      o              x",
      "xxxxxxxxx~~~~xxxxxx          x",
      "x            xx              x",
      "x            xx              x",
      "x                            x",
      "x                     xxxxxxxx",
      "x            xx              x",
      "x            xx              x",
      "x     o      xx              x",
      "x     xx~~~xxxxxxxxxxxxxxxxxxx",
      "x                            x",
      "x                  o         x",
      "x                 xxxx       x",
      "xxx                  xx      x",
      "x          xxx       x       x",
      "x                    x       x",
      "x                    x       x",
      "x~~~~~~xxxxxxxxxxxxxxxxxxxxxxx"
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
    this.scene.start("LevelOne");
  }
  nextLevel() {
    if (this.score == 5) {
      this.scene.start("LevelTwo");
    }
  }
}

export default LevelOne;
