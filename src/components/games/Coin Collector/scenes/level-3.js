class LevelThree extends Phaser.Scene {
  pointer;
  constructor() {
    super({ key: "LevelThree" });
  }
  preload() {}
  create() {
    this.score = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.player = this.physics.add.image(30, 130, "player");
    this.player = this.physics.add.sprite(30, 130, "player", 3);
    this.level = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.exit = this.physics.add.staticImage(570, 450, "exit");
    this.lava = this.physics.add.staticGroup();
    this.player.setBounce(0.1);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "jump-left",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 3 }],
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "jump-right",
      frames: [{ key: "player", frame: 6 }],
      frameRate: 5,
      repeat: -1,
    });

    this.buildLevel();
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

    this.pointer = this.input.activePointer;
    var downY,
      upY,
      threshold = 50;
    this.input.on("pointerdown", function (pointer) {
      downY = pointer.y;
    });
    var pInstance = this.player;
    this.input.on("pointerup", function (pointer) {
      upY = pointer.y;
      if (upY + threshold < downY && pInstance.body.touching.down) {
        pInstance.setVelocityY(-300);
      }
    });
  }
  update() {
    if (this.player.body.touching.down) {
      this.direction = "stand";
    }
    if (this.direction == "left") {
      this.player.play("jump-left");
    } else if (this.direction == "right") {
      this.player.play("jump-right");
    }
    if (
      this.cursors.left.isDown ||
      (this.pointer.isDown && this.pointer.x + 10 < this.player.body.x)
    ) {
      this.player.setVelocityX(-150);
      if (this.player.body.touching.down) {
        this.player.anims.play("left", true);
      }
      this.direction = "left";
    } else if (
      this.cursors.right.isDown ||
      (this.pointer.isDown && this.pointer.x > this.player.body.x + 10)
    ) {
      this.player.setVelocityX(150);
      if (this.player.body.touching.down) {
        this.player.play("right", true);
      }
      this.direction = "right";
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.touching.down) {
        this.player.play("turn");
      }
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-260);
    }
  }
  buildLevel() {
    let levelArchitecture = [
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "x                            x",
      "x                            x",
      "x                            x",
      "x                            x",
      "x                            x",
      "x                            x",
      "x          xxxxxxxxxxxxxx xxxx",
      "x              ox    x       x",
      "x          xxxxxx    x       x",
      "xxx                  x       x",
      "x                    x   ~   x",
      "x                    x       x",
      "x                    x       x",
      "x       x            x o     x",
      "x       x            xxx     x",
      "x      ox         xxxx       x",
      "x      xx            x       x",
      "x       x            x       x",
      "x       x            x     xxx",
      "xo      xxxx        ox       x",
      "xx      x         xxxx       x",
      "x       x            x       x",
      "x~~~~~~~~~~~~~~~~~~~~xxxxxxxxx",
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
    this.scene.start("LevelThree");
  }
  nextLevel() {
    if (this.score == 5) {
      this.scene.start("LevelFour");
    }
  }
}

export default LevelThree;
