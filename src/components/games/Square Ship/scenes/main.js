import ship from "@/assets/games/9-square_ship/ship.png";
import barrier from "@/assets/games/9-square_ship/barrier.png";
class Main extends Phaser.Scene {
  saveData;
  gameOptions = {
    shipHorizontalSpeed: 400, // ship horizontal speed, can be modified to change gameplay
    barrierSpeed: 100, // barrier vertical speed, can be modified to change gameplay
    barrierGap: 150, // gap between two barriers, in pixels
    safeZones: 5 // amount of possible safe zone. It affects safe zone width
  };

  style = {
    fontSize: "30px"
  };
  constructor() {
    super({ key: "Main" });
  }
  preload() {
    this.load.image("ship", ship);
    this.load.image("barrier", barrier);
  }
  create() {
    this.ship = this.physics.add.sprite(
      this.game.config.width / 2,
      (this.game.config.height / 5) * 4,
      "ship"
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    // this.input.on("pointerdown", this.moveShip, this);
    // this.input.on("pointerup", this.stopShip, this);
    this.addBarriers();
  }

  moveShip(p) {
    let speedMultiplier = p.x < this.game.config.width / 2 ? -1 : 1;
    this.ship.body.velocity.x =
      this.gameOptions.shipHorizontalSpeed * speedMultiplier;
  }
  stopShip() {
    this.ship.body.velocity.x = 0;
  }
  addBarriers() {
    this.horizontalBarrierGroup = this.physics.add.group();
    for (let i = 0; i < 10; i++) {
      this.horizontalBarrierPool = [
        this.horizontalBarrierGroup.create(0, 0, "barrier"),
        this.horizontalBarrierGroup.create(0, 0, "barrier")
      ];
      this.placeHorizontalBarriers();
    }
    this.horizontalBarrierGroup.setVelocityY(this.gameOptions.barrierSpeed);
  }
  getTopmostBarrier() {
    let topmostBarrier = this.game.config.height;
    this.horizontalBarrierGroup.getChildren().forEach(function(barrier) {
      topmostBarrier = Math.min(topmostBarrier, barrier.y);
    });
    return topmostBarrier;
  }
  placeHorizontalBarriers() {
    let topmost = this.getTopmostBarrier();
    let holePosition = Phaser.Math.Between(0, this.gameOptions.safeZones - 1);
    this.horizontalBarrierPool[0].x =
      (holePosition * this.game.config.width) / this.gameOptions.safeZones;
    this.horizontalBarrierPool[0].y = topmost - this.gameOptions.barrierGap;
    this.horizontalBarrierPool[0].setOrigin(1, 0);
    this.horizontalBarrierPool[1].x =
      ((holePosition + 1) * this.game.config.width) /
      this.gameOptions.safeZones;
    this.horizontalBarrierPool[1].y = topmost - this.gameOptions.barrierGap;
    this.horizontalBarrierPool[1].setOrigin(0, 0);
    this.horizontalBarrierPool = [];
  }
  update() {
    if (this.cursors.left.isDown) {
      this.ship.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.ship.setVelocityX(160);
    } else {
      this.ship.setVelocityX(0);
    }
    this.ship.x = Phaser.Math.Wrap(this.ship.x, 0, this.game.config.width);
    this.physics.world.collide(
      this.ship,
      this.horizontalBarrierGroup,
      function() {
        this.scene.start("End");
      },
      null,
      this
    );
    this.horizontalBarrierGroup.getChildren().forEach(function(barrier) {
      if (barrier.y > this.game.config.height) {
        this.horizontalBarrierPool.push(barrier);
        if (this.horizontalBarrierPool.length == 2) {
          this.placeHorizontalBarriers();
        }
      }
    }, this);
  }
}

export default Main;
