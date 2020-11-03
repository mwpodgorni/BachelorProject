class LevelFive extends Phaser.Scene {
  pointer;
  constructor() {
    super({ key: "LevelFive" });
  }
  preload() {}
  create() {
    this.score = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    // this.player = this.physics.add.image(30, 450, "player");
    this.player = this.physics.add.sprite(30, 450, "player", 3);
    this.level = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.exit = this.physics.add.staticImage(30, 30, "exit");
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
      "x                            r",
      "xxo                          r",
      "xxx                          r",
      "xxx~                        or",
      "xxxx~                       xr",
      "xxxxx~                       r",
      "xxxxxxx                      r",
      "xxxxxxxxxxxxxxxxxxxxx        r",
      "x                 oxl        r",
      "x                 xxl        r",
      "x                xxxl       xr",
      "x         xxxxxxxxxxl        r",
      "x          xxxxxxxxxl        r",
      "x           xxxxxxxxlo       r",
      "xx           xxxxxxxlx       r",
      "x             xxxxxxl        r",
      "x     xxxx     xxxxxl        r",
      "x     x oxx     xxxxl        r",
      "x     x xxxx     xxxl       xr",
      "x     x xxxxx     xxl        r",
      "xx    x xxxxxx     xl        r",
      "x       xxxxxxx              r",
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ];
    for (var i = 0; i < levelArchitecture.length; i++) {
      for (var j = 0; j < levelArchitecture[i].length; j++) {
        if (levelArchitecture[i][j] == "x") {
          this.level.create(10 + 20 * j, 10 + 20 * i, "wall");
        } else if (levelArchitecture[i][j] == "~") {
          this.lava.create(10 + 20 * j, 10 + 20 * i, "lava");
        } else if (levelArchitecture[i][j] == "o") {
          this.coins.add(this.add.image(10 + 20 * j, 10 + 20 * i, "coin"));
        } else if (levelArchitecture[i][j] == "l") {
          this.lava.create(10 + 20 * j, 10 + 20 * i, "lava").angle = 90;
        } else if (levelArchitecture[i][j] == "r") {
          this.lava.create(10 + 20 * j, 10 + 20 * i, "lava").angle = -90;
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
    this.scene.start("LevelFive");
  }
  nextLevel() {
    if (this.score == 5) {
      this.scene.start("End");
    }
  }
}

export default LevelFive;
